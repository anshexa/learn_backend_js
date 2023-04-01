// только принимает запрос и возвращает ответ

import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {User} from "./user.model";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {Roles} from "../auth/role-auth.decorator";
import {RoleGuard} from "../auth/role.guard";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";

// endpoints /user/

@ApiTags('Пользователи')    // документирование для swagger
@Controller('user')        // сделать класс контроллером, обрабатывать запросы на /user/
export class UserController {

    constructor(private userService: UserService) {   // инъекция UserService, чтобы использовать сервис внутри контроллера
    }

    @ApiOperation({summary: 'Создать пользователя'})    // документирование для swagger
    @ApiResponse({status: 200, type: User})             // документирование для swagger
    @Post()                                                     // метод POST запускает ф-цию create()
    create(@Body() userDto: CreateUserDto) {                    // тело запроса получает по схеме CreateUserDto
        return this.userService.createUser(userDto);
    }

    @ApiOperation({summary: 'Получить всех пользователей'})    // документирование для swagger
    @ApiResponse({status: 200, type: [User]})             // документирование для swagger
    @Roles('ADMIN')                                         // каким ролям доступен эндпоинт
    // @UseGuards(JwtAuthGuard)                                        // ограничение доступа для неавторизованных
    @UseGuards(RoleGuard)                                          // ограничение по ролям
    @Get()                                                          // метод GET запускает ф-цию getAll()
    getAll() {
        return this.userService.getAllUsers();                     // возвращает результат из сервиса
    }

    @ApiOperation({summary: 'Выдать роль'})    // документирование для swagger
    @ApiResponse({status: 200})             // документирование для swagger
    @Roles('ADMIN')                                         // каким ролям доступен эндпоинт
    @UseGuards(RoleGuard)                                      // ограничение по ролям
    @Post('/role')                                // метод POST запускает ф-цию addRole()
    addRole(@Body() dto: AddRoleDto) {                   // тело запроса получает по схеме AddRoleDto
        return this.userService.addRole(dto);                     // возвращает результат из сервиса
    }

    @ApiOperation({summary: 'Забанить пользователя'})    // документирование для swagger
    @ApiResponse({status: 200})                          // документирование для swagger
    @Roles('ADMIN')                                         // каким ролям доступен эндпоинт
    @UseGuards(RoleGuard)                                      // ограничение по ролям
    @Post('/ban')                                          // метод POST запускает ф-цию ban()
    ban(@Body() dto: BanUserDto) {                   // тело запроса получает по схеме BanUserDto
        return this.userService.ban(dto);                     // возвращает результат из сервиса
    }
}
