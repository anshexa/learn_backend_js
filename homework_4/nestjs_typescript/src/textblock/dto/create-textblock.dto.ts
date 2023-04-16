// dto - не содержит логики,
// имеет только поля
// д/обмена данными м/у подсистемами (н-п, клиент-сервер, сервер-сервер)

import {ApiProperty} from "@nestjs/swagger";

// для создания текстового блока

export class CreateTextblockDto {    // какие поля нужны для создания Textblock

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
        description: 'Файл с изображением'
    })
    readonly image: string;


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
