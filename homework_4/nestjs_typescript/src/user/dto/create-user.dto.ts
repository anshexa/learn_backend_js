// dto - не содержит логики,
// имеет только поля
// д/обмена данными м/у подсистемами (н-п, клиент-сервер, сервер-сервер)


import {ApiProperty} from "@nestjs/swagger";

// для создания пользователя
export class CreateUserDto {    // какие поля нужны для создания User

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



