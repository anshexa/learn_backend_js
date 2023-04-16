// только принимает запрос и возвращает ответ

import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";

import {TextblockService} from "./textblock.service";
import {CreateTextblockDto} from "./dto/create-textblock.dto";
import {Textblock} from "./textblock.model";
import {Roles} from "../auth/role-auth.decorator";
import {RoleGuard} from "../auth/role.guard";
import {EditTextblockDto} from "./dto/edit-textblock.dto";

// endpoints /textblock/

@ApiTags('Текстовые блоки')    // документирование для swagger
@Controller('textblock')    // сделать класс контроллером, обрабатывать запросы на /textblock/
export class TextblockController {
    constructor(private textblockService: TextblockService) {   // инъекция TextblockService, чтобы использовать сервис внутри контроллера
    }

    @ApiOperation({summary: 'Создать текстовый блок'})    // документирование для swagger
    @ApiResponse({status: 200, type: Textblock})             // документирование для swagger
    @Roles('ADMIN')                                         // каким ролям доступен эндпоинт
    @UseGuards(RoleGuard)                                          // ограничение по ролям
    @Post()
    @UseInterceptors(FileInterceptor('image'))              // чтобы принимать form-data, для работы с файлами, название переменной, в которую положится файл
    create(@Body() textblockDto: CreateTextblockDto,                // тело запроса получает по схеме CreateTextblockDto
           @UploadedFile() image) {                                 // чтобы получить файл в эндпоинте
        return this.textblockService.createTextblock(textblockDto, image);
    }

    @ApiOperation({summary: 'Получить все текстовые блоки'})    // документирование для swagger
    @ApiResponse({status: 200, type: Textblock})             // документирование для swagger
    @Get()
    getAll() {
        return this.textblockService.getAllTextblocks()
    }

    @ApiOperation({summary: 'Получить текстовые блоки по группе'})    // документирование для swagger
    @ApiResponse({status: 200, type: Textblock})             // документирование для swagger
    @Get('/:groupName')
    getByGroup(@Param('groupName') groupName: string) {
        return this.textblockService.getTextblocksByGroup(groupName)
    }

    @ApiOperation({summary: 'Редактировать текстовый блок'})    // документирование для swagger
    @ApiResponse({status: 200, type: Textblock})             // документирование для swagger
    @Roles('ADMIN')                                         // каким ролям доступен эндпоинт
    @UseGuards(RoleGuard)                                          // ограничение по ролям
    @Put('/edit/:textblockId')
    @UseInterceptors(FileInterceptor('image'))              // чтобы принимать form-data, для работы с файлами, название переменной, в которую положится файл
    editTextblock(@Param('textblockId') textblockId: number,    // @Param - считываем параметр textblockId
                  @Body() textblockDto: EditTextblockDto,             // тело запроса получает по схеме EditTextblockDto
                  @UploadedFile() image) {                                 // чтобы получить файл в эндпоинте
        return this.textblockService.editTextblock(textblockId, textblockDto, image)
    }

    @ApiOperation({summary: 'Удалить текстовый блок'})    // документирование для swagger
    @ApiResponse({status: 200})             // документирование для swagger
    @Roles('ADMIN')                                         // каким ролям доступен эндпоинт
    @UseGuards(RoleGuard)                                          // ограничение по ролям
    @Delete('/delete/:textblockId')
    deleteTextblock(@Param('textblockId') textblockId: number) {       // @Param - считываем параметр textblockId
        return this.textblockService.deleteTextblock(textblockId)
    }

}
