// подмодуль
// работает с бд
// описывает схему того, как user сохраняется в бд

import {BelongsToMany, Column, DataType, HasOne, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

import {Role} from "../role/role.model";
import {UserRole} from "../role/user-role.model";
import {Profile} from "../profile/profile.model";

interface UserCreationAttrs {   // поля, необходимые для создания класса User
    email: string,
    password: string
}

@Table({tableName: 'user'})        // чтобы класс стал таблицей в бд, таблица user
export class User extends Model<User, UserCreationAttrs> {

    @ApiProperty({              // документирование для swagger Responses Schema
        example: '1',
        description: 'Уникальный идентификатор'
    })
    @Column({                   // чтобы поле стало колонкой в таблице в бд
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;     // поле


    @ApiProperty({              // документирование для swagger Responses Schema
        example: 'user@mail.com',
        description: 'Электропочта'
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false    // не может быть пустым
    })
    email: string;     // поле


    @ApiProperty({      // документирование для swagger Responses Schema
        example: '12345678',
        description: 'Пароль'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    password: string;     // поле


    @ApiProperty({     // документирование для swagger Responses Schema
        example: 'true',
        description: 'Забанен или нет'
    })
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false      // по умолч не забанен
    })
    banned: boolean;     // поле


    @ApiProperty({       // документирование для swagger Responses Schema
        example: 'За хулиганство',
        description: 'Причина блокировки'
    })
    @Column({
        type: DataType.STRING,
        allowNull: true     // может быть пустым
    })
    banReason: string;     // поле


    // многие-ко-многим
    @BelongsToMany(() => Role, () => UserRole)      // связываем User с Role через UserRole
    role: Role[];     // поле: тип


    // один-к-одному
    @HasOne(() => Profile)          // имеет один профиль
    profile: Profile;           // поле: тип

}
