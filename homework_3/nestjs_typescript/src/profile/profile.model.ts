// подмодуль
// работает с бд
// описывает схему того, как user сохраняется в бд

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

import {User} from "../user/user.model";

interface ProfileCreationAttrs {   // поля, необходимые для создания класса Profile
    firstName: string,
    lastName: string,
    phone: string,
    userId: number;
}


@Table({tableName: 'profile'})        // чтобы класс стал таблицей в бд, таблица profile
export class Profile extends Model<Profile, ProfileCreationAttrs> {

    @ApiProperty({              // документирование для swagger Responses Schema
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


    @ApiProperty({              // документирование для swagger Responses Schema
        example: 'Саша',
        description: 'Имя'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false    // не может быть пустым
    })
    firstName: string;     // поле


    @ApiProperty({              // документирование для swagger Responses Schema
        example: 'Гроза',
        description: 'Фамилия'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false    // не может быть пустым
    })
    lastName: string;     // поле


    @ApiProperty({              // документирование для swagger Responses Schema
        example: '89271112233',
        description: 'Номер телефона'
    })
    @Column({
        type: DataType.STRING,
        allowNull: false    // не может быть пустым
    })
    phone: string;     // поле


    @ForeignKey(() => User)     // внешний ключ, ссылается на User
    @Column({
        type: DataType.INTEGER
    })
    userId: number;     // поле


    // один-к-одному
    @BelongsTo(() => User)      // принадлежит одному юзеру
    user: User;         // поле: тип

}
