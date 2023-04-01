// dto - не содержит логики,
// имеет только поля
// д/обмена данными м/у подсистемами (н-п, клиент-сервер, сервер-сервер)

import {ApiProperty} from "@nestjs/swagger";

// для создания роли
export class CreateRoleDto {    // какие поля нужны для создания Role

    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: 'ADMIN',
        description: 'Уникальное значение роли'
    })
    readonly value: string;

    @ApiProperty({              // документирование для swagger, что ожидаем на входе, Request Schema
        example: 'Администратор',
        description: 'Описание роли'
    })
    readonly description: string;
}
