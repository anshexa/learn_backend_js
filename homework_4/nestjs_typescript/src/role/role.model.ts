// подмодуль
// работает с бд
// описывает схему того, как user сохраняется в бд

import {BelongsToMany, Column, DataType, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

import {User} from "../user/user.model";
import {UserRole} from "./user-role.model";

interface RoleCreationAttrs {   // поля, которые нужны для создания класса Role
    value: string,
    description: string
}

@Table({tableName: 'role'})             // чтобы класс стал таблицей в бд, таблица role
export class Role extends Model<Role, RoleCreationAttrs> {

    @ApiProperty({      // документирование для swagger Responses Schema
        example: '1',
        description: 'Уникальный идентификатор'
    })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;     // поле


    @ApiProperty({      // документирование для swagger Responses Schema
        example: 'ADMIN',
        description: 'Уникальное значение роли'
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false
    })
    value: string;     // поле


    @ApiProperty({          // документирование для swagger Responses Schema
        example: 'Администратор',
        description: 'Описание роли'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    description: string;     // поле


    // многие-ко-многим
    @BelongsToMany(() => User, () => UserRole)      // связываем Role с User через UserRole
    user: User[];           // поле: тип

}
