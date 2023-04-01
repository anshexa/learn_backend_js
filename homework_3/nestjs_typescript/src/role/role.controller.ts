// только принимает запрос и возвращает ответ

import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

import {RoleService} from "./role.service";
import {CreateRoleDto} from "./dto/create-role.dto";
import {Role} from "./role.model";


// endpoints /role/
@ApiTags('Роли')    // документирование для swagger
@Controller('role')
export class RoleController {
    constructor(private roleService: RoleService) {
    }

    @ApiOperation({summary: 'Создать роль'})    // документирование для swagger
    @ApiResponse({status: 200, type: Role})             // документирование для swagger
    @Post()
    create(@Body() dto: CreateRoleDto) {
        return this.roleService.createRole(dto);
    }

    @ApiOperation({summary: 'Получить роль по значению'})    // документирование для swagger
    @ApiResponse({status: 200, type: Role})             // документирование для swagger
    @Get('/:value')
    getByValue(@Param('value') value: string) {     // @Param - считываем параметр value
        return this.roleService.getRoleByValue(value);
    }
}
