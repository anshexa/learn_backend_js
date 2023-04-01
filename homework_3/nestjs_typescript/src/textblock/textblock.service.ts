// все, что содержит логику и
// может использоваться в других компонентах
// н-п, обращение к бд

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";

import {CreateTextblockDto} from "./dto/create-textblock.dto";
import {Textblock} from "./textblock.model";
import {FileService} from "../file/file.service";
import {EditTextblockDto} from "./dto/edit-textblock.dto";


@Injectable()       // чтобы класс стал провайдером
export class TextblockService {
    constructor(
        @InjectModel(Textblock)      // чтобы могли делать запись в бд
        private textblockRepository: typeof Textblock,      // будет взаимод-вать с бд
        private fileService: FileService
    ) {
    }


    // создать текстовый блок в бд
    async createTextblock(textblockDto: CreateTextblockDto,     // параметр textblockDto: тип
                          image: any) {
        try {
            // создаем текстовый блок в бд
            const textblock = await this.textblockRepository.create(textblockDto);

            const essenceTable = 'textblock';
            const essenceId = textblock.id;
            // сохраняем файл на сервере
            const file = await this.fileService.saveFile(
                image,
                essenceTable, essenceId                // для связи текстового блока с файлом
            )

            textblock.dataValues.image = [file]         // добавляем file в объект textblock

            return textblock;

        } catch (e) {
            if (e.message == 'Validation error') {
                throw new HttpException(
                    `${e.original.detail}`,
                    HttpStatus.BAD_REQUEST
                )
            }
            throw e
        }
    }


    // получить все текстовые блоки из бд
    async getAllTextblocks() {
        const textblocks = await this.textblockRepository.findAll({
            include: {all: true},    // добавить все поля всех моделей, которые связаны с текстовым блоком
            order: [['id', 'DESC']]      // отсортировать по id
        })
        return textblocks;
    }


    // получить текстовые блоки по группе из бд
    async getTextblocksByGroup(groupName: string) {
        const textblocks = await this.textblockRepository.findAll({
            where: {group: groupName}
        })
        return textblocks;
    }


    // редактировать текстовый блок в бд
    async editTextblock(textblockId: number,
                        textblockDto: EditTextblockDto,
                        image: any) {
        if (image) {
            const essenceTable = 'textblock';
            const essenceId = textblockId;
            // удаляем связь старого файла с данным текстовым блоком
            const oldFile = await this.fileService.deleteRelationWithEssence(
                essenceTable, essenceId)
            // сохраняем новый файл на сервере, и связываем его
            const newFile = await this.fileService.saveFile(
                image,
                essenceTable, essenceId                // для связи между текстовым блоком и файлом
            )
        }
        const textblock = await this.textblockRepository.update(
            textblockDto,
            {
                where: {id: textblockId},
                returning: true             // вернуть все поля
            })
        if (textblock[0] === 0) {         // если ноль обновленных полей
            throw new HttpException(
                'Текстовый блок не найден ' +
                'или поля для обновления не переданы',
                HttpStatus.NOT_FOUND);
        }
        return textblock[1][0];
    }


    // удалить текстовый блок по id из бд
    async deleteTextblock(textblockId: number) {
        const essenceTable = 'textblock';
        const essenceId = textblockId;
        // удаляем связь файла с данным текстовым блоком
        const file = await this.fileService.deleteRelationWithEssence(
            essenceTable, essenceId)
        // удаляем текстовый блок
        const num = await this.textblockRepository.destroy({
            where: {id: textblockId},
        })

        if (num == 0) {         // если количество удаленных блоков=0
            throw new HttpException(
                'Текстовый блок для удаления не найден',
                HttpStatus.NOT_FOUND);
        }
        return {message: 'Текстовый блок удален'}
    }
}
