// все, что содержит логику и
// может использоваться в других компонентах
// н-п, обращение к бд

import {HttpException, HttpStatus, Injectable, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'

import {CreateUserDto} from "../user/dto/create-user.dto";
import {UserService} from "../user/user.service";
import {User} from "../user/user.model";
import {CreateUserProfileDto} from "../user/dto/create-user-profile.dto";
import {ProfileService} from "../profile/profile.service";

@Injectable()       // чтобы класс стал провайдером
export class AuthService {

    constructor(private userService: UserService,             // инъекция UserService, чтобы использовать сервис внутри контроллера
                private jwtService: JwtService,             // JwtService идет вместе в Jwt модулем
                private profileService: ProfileService      // инъекция ProfileService, чтобы использовать сервис внутри контроллера
    ) {
    }

    // залогинить пользователя
    async login(userDto: CreateUserDto) {      // тело запроса принять по схеме CreateUserDto
        const user = await this.validateUser(userDto)
        return this.generateToken(user)         // возвращаем токен
    }

    // зарегистрировать пользователя
    async registrationUser(userDto: CreateUserDto) {      // тело запроса принять по схеме CreateUserDto
        const candidate = await this.userService.getUserByEmail(userDto.email)
        if (candidate) {    // если кандидат уже есть, бросаем ошибку
            throw new HttpException(
                'Пользователь с таким email уже существует',
                HttpStatus.BAD_REQUEST
            )
        }
        // хешируем пароль
        const hashPassword = await bcrypt.hash(userDto.password, 5);    // пароль, соль
        const user = await this.userService.createUser({
            ...userDto,
            password: hashPassword      // вместо пароля в dto отправляем захешированный пароль
        })
        return this.generateToken(user)     // возвращаем токен
    }

    // генерируем токен
    private async generateToken(user: User) {
        const payload = {
            email: user.email,
            id: user.id,
            role: user.role
        }
        return {
            token: this.jwtService.sign(payload)        // генерируем токен
        }
    }

    private async validateUser(userDto: CreateUserDto) {
        try {
            // ищем в бд польз-ля по email
            const user = await this.userService.getUserByEmail(userDto.email);
            // сверяем пароли
            const passwordEquals = await bcrypt.compare(userDto.password, user.password)
            if (user && passwordEquals) {
                return user;
            }
            throw new UnauthorizedException({
                message: 'Некорректный емейл или пароль'
            })
        } catch (e) {
            throw new UnauthorizedException({
                message: 'Некорректный емейл или пароль'
            })
        }

    }

    // зарегистрировать пользователя и создать профиль
    async registrationUserProfile(userProfileDto: CreateUserProfileDto) {
        const user = await this.registrationUser(userProfileDto)
        const profile = await this.profileService.createProfile(userProfileDto)
        return user;
    }
}
