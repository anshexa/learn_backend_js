// все, что содержит логику и
// может использоваться в других компонентах
// н-п, обращение к бд

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as uuid from 'uuid'
import {InjectModel} from "@nestjs/sequelize";
import {Op} from "sequelize";

import * as path from "node:path";
import * as fs from "node:fs";

import {File} from "./file.model";


@Injectable()                   // чтобы класс стал провайдером
export class FileService {

    constructor(
        @InjectModel(File)      // чтобы могли делать запись в бд
        private fileRepository: typeof File,      // будет взаимод-вать с бд
    ) {
    }


    // сохраняет файл на сервере и создает запись о нем в бд
    async saveFile(file,
                   essenceTable: string = null,
                   essenceId: number = null): Promise<File> {       // принимает файл и параметры таблицы/строки, для которой вызван метод, возвращает промис (созданный файл)
        try {
            // записываем файл на сервер
            const fileName = await this.saveFileOnServer(file)
            // создаем запись о файле в бд, таблице file
            const createdFile = await this.createFileInDB(fileName, essenceTable, essenceId)
            return createdFile;
        } catch (e) {
            throw new HttpException(
                'Произошла ошибка при записи файла',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    private async saveFileOnServer(file): Promise<string> {       // принимает файл, возвращает промис (название файла)
        try {
            const fileName = `${uuid.v4()}.jpg`     // генерируем уникальное название
            const filePath = path.resolve(__dirname, '..', 'static')  // составляем абсолютный путь к файлу - текущая папка->выше на одну->папка static
            // если по этому пути ничего не существует, то создаем папку
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})     // recursive - если какой-то папки в пути не будет, ее создаст
            }
            // если папка существует, записываем в нее файл
            fs.writeFileSync(path.join(filePath, fileName), file.buffer);   // склеиваем путь с названием файла, передаем буфер
            return fileName
        } catch (e) {
            throw new HttpException(
                'Произошла ошибка при записи файла',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }


    // создать файл в бд
    private async createFileInDB(fileName,
                                 essenceTable: string = null,
                                 essenceId: number = null) {
        const fileData = {
            image: fileName,
            essenceTable: essenceTable,
            essenceId: essenceId
        }
        const file = await this.fileRepository.create(fileData);
        return file;
    }


    // удалить лишние файлы
    async deleteExcessFiles() {
        const options = {
            where: {            // WHERE essenceId IS NULL AND essenceTable IS NULL AND createdAt < 1час назад
                [Op.and]: [{
                    essenceId: {
                        [Op.is]: null           // IS NULL
                    },
                    essenceTable: {
                        [Op.is]: null           // IS NULL
                    },
                    createdAt: {
                        [Op.lt]: new Date(Date.now() - 1 * 60 * 60 * 1000)      // раньше, чем час назад
                    }
                }]
            },
        }
        // находим записи о файлах в бд
        const files = await this.fileRepository.findAll(options)

        for (const file of files) {
            const fileName = file['image']

            // удаляем файлы с сервера
            await this.deleteFileOnServer(fileName)
        }

        // удаляем записи о файле в бд
        const num = await this.fileRepository.destroy(options)

        return {message: `Удалено записей: ${num} `}
    }


    // удалить файлы с сервера
    private async deleteFileOnServer(fileName) {
        const filePath = path.resolve(__dirname, '..', 'static')  // составляем абсолютный путь к файлу - текущая папка->выше на одну->папка static
        try {
            // удаляем файл
            fs.unlinkSync(path.join(filePath, fileName));   // склеиваем путь с названием файла
            return {message: 'Файл с сервера удален'}
        } catch (e) {
            console.log(e)
            // throw new HttpException(
            //     'Произошла ошибка при удалении файла',
            //     HttpStatus.INTERNAL_SERVER_ERROR
            // )
        }
    }


    // получить все файлы из бд
    async getAllFiles() {
        const files = await this.fileRepository.findAll({
            order: [['id', 'DESC']]      // отсортировать по id
        })
        return files
    }


    // удаляем связь файла в бд с сущностью, к которой был привязан
    async deleteRelationWithEssence(essenceTable: string, essenceId: number) {
        const file = await this.fileRepository.update(
            {
                essenceTable: null,
                essenceId: null,
            },
            {
                where: {            // WHERE essenceId=essenceId AND essenceTable=essenceTable
                    [Op.and]: [{
                        essenceId: essenceId,
                        essenceTable: essenceTable,
                    }]
                }
            }
        )
        return file
    }

}
