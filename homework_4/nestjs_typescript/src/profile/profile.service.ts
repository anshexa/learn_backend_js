// все, что содержит логику и
// может использоваться в других компонентах
// н-п, обращение к бд

import {forwardRef, HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {JwtService} from "@nestjs/jwt";

import {Profile} from "./profile.model";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {AuthService} from "../auth/auth.service";
import {EditProfileDto} from "./dto/edit-profile.dto";

@Injectable()          // чтобы класс стал провайдером
export class ProfileService {

    constructor(
        @InjectModel(Profile)       // чтобы могли делать запись в бд
        private profileRepository: typeof Profile,      // будет взаимод-вать с бд
        @Inject(forwardRef(() => AuthService))      // решение проблемы "не удается разрешить зависимости", чтобы Nest видел аргумент
        private authService: AuthService,
        private jwtService: JwtService) {
    }

    // создать профиль в бд
    async createProfile(profileDto: CreateProfileDto) {      // параметр profileDto: тип
        // авторизуем юзера, получаем его id
        const tokenObj = await this.authService.login(profileDto)
        const user = this.jwtService.verify(tokenObj.token)   // раскодируем токен
        const userId = user.id;

        // проверяем, есть ли уже профиль
        const existingProfile = await this.getProfileByUserId(userId)
        if (existingProfile) {
            throw new HttpException(
                'Профиль пользователя уже существует',
                HttpStatus.BAD_REQUEST
            )
        }

        const profile = await this.profileRepository.create({
            ...profileDto,
            userId: userId          // добавляем в поле userId перед созданием
        });

        return profile;
    }


    // есть профиль у этого пользователя в бд
    async getProfileByUserId(userId: number) {
        const profile = await this.profileRepository.findOne({
            where: {userId: userId},
            include: {all: true}    // добавить все поля всех моделей, которые связаны с профилем
        })
        return profile;
    }


    // редактировать профиль в бд
    async editProfile(profileId: number, profileDto: EditProfileDto) {
        const profile = await this.profileRepository.update(profileDto, {
            where: {id: profileId},
            returning: true             // вернуть все поля
        })
        if (profile[0] === 0) {         // если ноль обновленных полей
            throw new HttpException(
                'Профиль не найден ' +
                'или поля для обновления не переданы',
                HttpStatus.NOT_FOUND);
        }
        return profile[1][0];
    }

    // удалить профиль по id из бд
    async deleteProfile(profileId: number) {
        const num = await this.profileRepository.destroy({
            where: {id: profileId},
        })
        if (num == 0) {
            throw new HttpException(
                'Профиль для удаления не найден',
                HttpStatus.NOT_FOUND);
        }
        return {message: 'Профиль удален'}
    }
}
