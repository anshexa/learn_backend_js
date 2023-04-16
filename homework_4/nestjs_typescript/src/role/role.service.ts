// все, что содержит логику и
// может использоваться в других компонентах
// н-п, обращение к бд

import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";

import {CreateRoleDto} from "./dto/create-role.dto";
import {Role} from "./role.model";

@Injectable()       // чтобы класс стал провайдером
export class RoleService {

    constructor(
        @InjectModel(Role)      // чтобы могли делать запись в бд
        private roleRepository: typeof Role) {       // будет взаимод-вать с бд
    }

    // создание роли в бд
    async createRole(dto: CreateRoleDto) {   // параметр dto: тип
        const role = await this.roleRepository.create(dto);
        return role;
    }

    // получение из бд
    async getRoleByValue(value: string) {
        const role = await this.roleRepository.findOne({
            where: {value}
        })
        return role;
    }
}
