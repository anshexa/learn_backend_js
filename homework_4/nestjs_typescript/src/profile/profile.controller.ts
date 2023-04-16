// только принимает запрос и возвращает ответ

import {Body, Controller, Delete, Param, Post, Put, UseGuards} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

import {ProfileService} from "./profile.service";
import {Profile} from "./profile.model";
import {CreateProfileDto} from "./dto/create-profile.dto";
import {EditProfileDto} from "./dto/edit-profile.dto";
import {Roles} from "../auth/role-auth.decorator";
import {RoleGuard} from "../auth/role.guard";
import {OwnerCurrentUserRoleGuard} from "../auth/owner-current-user-role.guard";

// endpoints /profile/

@ApiTags('Профили')    // документирование для swagger
@Controller('profile')      // сделать класс контроллером, обрабатывать запросы на /profile/
export class ProfileController {

    constructor(private profileService: ProfileService) {   // инъекция ProfileService, чтобы использовать сервис внутри контроллера
    }

    @ApiOperation({summary: 'Создать профиль'})    // документирование для swagger
    @ApiResponse({status: 201, type: Profile})             // документирование для swagger
    @Post()
    create(@Body() profileDto: CreateProfileDto) {          // тело запроса получает по схеме CreateProfileDto
        return this.profileService.createProfile(profileDto);
    }

    @ApiOperation({summary: 'Редактировать профиль'})    // документирование для swagger
    @ApiResponse({status: 200, type: Profile})             // документирование для swagger
    @Roles('ADMIN')                                         // каким ролям доступен эндпоинт
    @UseGuards(OwnerCurrentUserRoleGuard)                        // доступно совпадающему по id юзеру и админу
    @Put('/edit/:profileId')
    editProfile(@Param('profileId') profileId: number, // @Param - считываем параметр profileId
                @Body() profileDto: EditProfileDto) {           // тело запроса получает по схеме EditProfileDto
        return this.profileService.editProfile(profileId, profileDto)
    }

    @ApiOperation({summary: 'Удалить профиль'})    // документирование для swagger
    @ApiResponse({status: 200})             // документирование для swagger
    @Roles('ADMIN')                                         // каким ролям доступен эндпоинт
    @UseGuards(OwnerCurrentUserRoleGuard)                        // доступно совпадающему по id юзеру и админу
    @Delete('/delete/:profileId')
    deleteProfile(@Param('profileId') profileId: number) {       // @Param - считываем параметр profileId
        return this.profileService.deleteProfile(profileId)
    }
}
