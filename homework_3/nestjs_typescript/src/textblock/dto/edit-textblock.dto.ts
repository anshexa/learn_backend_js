// dto - не содержит логики,
// имеет только поля
// д/обмена данными м/у подсистемами (н-п, клиент-сервер, сервер-сервер)


import {ApiProperty} from "@nestjs/swagger";

// для редактирования текстового блока

export class EditTextblockDto {    // какие поля нужны для редактирования Textblock

    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: 'main-hero-text',
        description: 'Уникальное название для поиска'
    })
    readonly blockname: string;


    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        description: 'Заголовок'
    })
    readonly title: string;


    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        description: 'Текст'
    })
    readonly text: string;


    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: 'main-page',
        description: 'Группа'
    })
    readonly group: string;
}
