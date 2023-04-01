// подмодуль
// работает с бд
// описывает схему того, как file сохраняется в бд

import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

import {Textblock} from "../textblock/textblock.model";

interface FileCreationAttrs {   // поля, необходимые для создания класса File
    image: string,
    essenceTable: string,
    essenceId: number,
}

@Table({tableName: 'file'})        // чтобы класс стал таблицей в бд, таблица file
export class File extends Model<File, FileCreationAttrs> {

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
        description: 'Название изображения',
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false    // не может быть пустым
    })
    image: string     // поле


    @ApiProperty({              // документирование для swagger Responses Schema
        example: 'profile',
        description: 'Название таблицы, в которой используется'
    })
    @Column({
        type: DataType.STRING,
        allowNull: true     // может быть пустым
    })
    essenceTable: string;     // поле


    @ForeignKey(() => Textblock)     // внешний ключ, ссылается на Textblock
    @ApiProperty({              // документирование для swagger Responses Schema
        example: '1',
        description: 'id записи в таблице, в которой используется'
    })
    @Column({
        type: DataType.INTEGER,
        allowNull: true     // может быть пустым
    })
    essenceId: number;     // поле


    // один-ко-многим
    @BelongsTo(() => Textblock)      // принадлежит одному текстовому блоку
    user: Textblock;         // поле: тип
}
