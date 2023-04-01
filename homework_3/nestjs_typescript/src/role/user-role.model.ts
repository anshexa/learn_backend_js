// подмодуль
// работает с бд
// описывает схему того, как user сохраняется в бд

import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";

import {User} from "../user/user.model";
import {Role} from "./role.model";


// промежуточная табл для связи многие-ко-многим
@Table({                // чтобы класс стал таблицей в бд, таблица user_role
    tableName: 'user_role',
    createdAt: false,       // не добавлять дату создания
    updatedAt: false        // не добавлять дату обновления
})
export class UserRole extends Model<UserRole> {

    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    })
    id: number;

    @ForeignKey(() => Role)     // внешний ключ, ссылается на Role
    @Column({
        type: DataType.INTEGER
    })
    roleId: number;

    @ForeignKey(() => User)     // внешний ключ, ссылается на User
    @Column({
        type: DataType.INTEGER
    })
    userId: number;

}
