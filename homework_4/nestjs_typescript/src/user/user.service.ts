// все, что содержит логику и
// может использоваться в других компонентах
// н-п, обращение к бд

import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";

import {User} from "./user.model";
import {CreateUserDto} from "./dto/create-user.dto";
import {RoleService} from "../role/role.service";
import {AddRoleDto} from "./dto/add-role.dto";
import {BanUserDto} from "./dto/ban-user.dto";

@Injectable()       // чтобы класс стал провайдером
export class UserService {

    constructor(
        @InjectModel(User)      // чтобы могли делать запись в бд
        private userRepository: typeof User,    // будет взаимод-вать с бд
        private roleService: RoleService) {
    }

    // создать пользователя в бд
    async createUser(dto: CreateUserDto) {   // параметр dto: тип
        const user = await this.userRepository.create(dto);
        // получить роль 'USER' из бд, по умолч присвоить роль 'USER'
        const role = await this.roleService.getRoleByValue('USER')
        // перезаписать поле 'role' в бд
        await user.$set('role', [role.id])
        user.role = [role]     // добавляем роль в объект user
        return user;
    }

    // получить пользователей из бд
    async getAllUsers() {
        const users = await this.userRepository.findAll({
            include: {all: true},    // добавить все поля всех моделей, которые связаны с пользователем
            order: [ [ 'id', 'ASC' ] ]      // отсортировать по id
        });
        return users;
    }

    // есть пользователь с данным email в бд
    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: {email},
            include: {all: true}    // добавить все поля всех моделей, которые связаны с пользователем
        })
        return user;
    }

    // добавить роль пользователю
    async addRole(dto: AddRoleDto) {        // параметр dto: тип
        // ищем пользователя по id в dto в бд
        const user = await this.userRepository.findByPk(dto.userId);
        // ищем роль со значением dto.value в бд
        const role = await this.roleService.getRoleByValue(dto.value);
        if (user && role) {      // и пользователь и роль найдены в бд
            // добавляем пользователю эту роль
            await user.$add('role', role.id);
            return dto;
        }
        throw new HttpException(
            'Пользователь или роль не найдены',
            HttpStatus.NOT_FOUND);
    }

    // забанить
    async ban(dto: BanUserDto) {            // параметр dto: тип
        // ищем пользователя по id в dto в бд
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user){
            throw new HttpException(
                'Пользователь не найден',
                HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        // обновляем значения в бд
        await user.save();
        return user;
    }

}
