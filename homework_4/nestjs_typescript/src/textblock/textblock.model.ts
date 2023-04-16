// подмодуль
// работает с бд
// описывает схему того, как textblock сохраняется в бд

import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";
import {File} from "../file/file.model";

interface TextblockCreationAttrs {   // поля, необходимые для создания класса Textblock
    blockname: string,
    title: string,
    image: string,
    text: string,
    group: string
}

@Table({tableName: 'textblock'})        // чтобы класс стал таблицей в бд, таблица textblock
export class Textblock extends Model<Textblock, TextblockCreationAttrs> {

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
        example: 'main-hero-text',
        description: 'Уникальное название для поиска'
    })
    @Column({
        type: DataType.STRING,
        unique: true,
        allowNull: false    // не может быть пустым
    })
    blockname: string;     // поле


    @ApiProperty({              // документирование для swagger Responses Schema
        description: 'Заголовок'
    })
    @Column({
        type: DataType.STRING,
        allowNull: true     // может быть пустым
    })
    title: string;     // поле


    @ApiProperty({              // документирование для swagger Responses Schema
        description: 'Текст'
    })
    @Column({
        type: DataType.TEXT,
        allowNull: true     // может быть пустым
    })
    text: string;     // поле


    @ApiProperty({              // документирование для swagger Responses Schema
        example: 'main-page',
        description: 'Группа'
    })
    @Column({
        type: DataType.STRING,
        allowNull: true     // может быть пустым
    })
    group: string;     // поле


    // один-ко-многим
    @HasMany(() => File)          // имеет несколько изображений
    image: File[];     // поле: тип
}
