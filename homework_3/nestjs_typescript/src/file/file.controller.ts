// только принимает запрос и возвращает ответ

import {Controller, Delete, Get} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

import {FileService} from "./file.service";
import {File} from "./file.model";

@ApiTags('Файлы')    // документирование для swagger
@Controller('file')         // сделать класс контроллером, обрабатывать запросы на /file/
export class FileController {

    constructor(private fileService: FileService) {   // инъекция FileService, чтобы использовать сервис внутри контроллера
    }

    @ApiOperation({summary: 'Удалить все лишние файлы'})    // документирование для swagger
    @ApiResponse({status: 200})                             // документирование для swagger
    @Delete('/deleteExcess')
    deleteExcessFiles() {
        return this.fileService.deleteExcessFiles()
    }

    @ApiOperation({summary: 'Получить список всех файлов'})    // документирование для swagger
    @ApiResponse({status: 200, type: [File]})                   // документирование для swagger
    @Get()
    getAll(){
        return this.fileService.getAllFiles()
    }
}
