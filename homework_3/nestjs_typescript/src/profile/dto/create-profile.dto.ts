// dto - не содержит логики,
// имеет только поля
// д/обмена данными м/у подсистемами (н-п, клиент-сервер, сервер-сервер)

import {ApiProperty} from "@nestjs/swagger";

// для создания профиля
export class CreateProfileDto {          // какие поля нужны для создания Profile

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


    // для авторизации
    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: 'user@mail.com',
        description: 'Электропочта'
    })
    readonly email: string;


    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: '12345678',
        description: 'Пароль'
    })
    readonly password: string;

}
