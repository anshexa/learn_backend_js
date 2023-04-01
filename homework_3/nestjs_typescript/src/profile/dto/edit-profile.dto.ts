// dto - не содержит логики,
// имеет только поля
// д/обмена данными м/у подсистемами (н-п, клиент-сервер, сервер-сервер)

import {ApiProperty} from "@nestjs/swagger";

export class EditProfileDto {            // какие поля нужны для редактирования Profile

    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: 'Саша',
        description: 'Имя'
    })
    readonly firstName: string;

    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: 'Гроза',
        description: 'Фамилия'
    })
    readonly lastName: string;

    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: '89271112233',
        description: 'Номер телефона'
    })
    readonly phone: string;

}
