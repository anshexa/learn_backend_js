// только принимает запрос и возвращает ответ

import {Body, Controller, Post} from '@nestjs/common';
import {ApiOperation, ApiTags} from "@nestjs/swagger";

import {CreateUserDto} from "../user/dto/create-user.dto";
import {AuthService} from "./auth.service";
import {CreateUserProfileDto} from "../user/dto/create-user-profile.dto";

@ApiTags('Авторизация')     // документирование для swagger
@Controller('auth')         // сделать класс контроллером, обрабатывать запросы на /auth/
export class AuthController {

    constructor(private authService: AuthService) {     // инъекция AuthService, чтобы использовать сервис внутри контроллера
    }

    @ApiOperation({summary: 'Авторизация пользователя'})    // документирование для swagger
    @Post('/login')
    login(@Body() userDto: CreateUserDto) {      // тело запроса принять по схеме CreateUserDto
        return this.authService.login(userDto)
    }

    @ApiOperation({summary: 'Регистрация пользователя'})    // документирование для swagger
    @Post('/registrationUser')
    registrationUser(@Body() userDto: CreateUserDto) {      // тело запроса принять по схеме CreateUserDto
        return this.authService.registrationUser(userDto)
    }

    @ApiOperation({summary: 'Регистрация пользователя с созданием профиля'})    // документирование для swagger
    @Post('/registrationUserWithProfile')
    registrationUserWithProfile(@Body() userProfileDto: CreateUserProfileDto) {
        return this.authService.registrationUserProfile(userProfileDto)
    }

}
