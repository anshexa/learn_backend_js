// координирует составляющие

import {forwardRef, Module} from '@nestjs/common';
import {JwtModule} from "@nestjs/jwt";

import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UserModule} from "../user/user.module";
import {ProfileModule} from "../profile/profile.module";

@Module({
    controllers: [AuthController],
    providers: [AuthService],       // чтобы в контроллере использовать логику
    imports: [
        forwardRef(() => UserModule),               // чтобы использовать модель в AuthService, forwardRef - чтобы предотвратить кольцевую зависимость
        JwtModule.register({                        // регистрация jwt модуля для авторизации
            secret: process.env.PRIVATE_KEY || 'SECRET',
            signOptions: {
                expiresIn: '24h'                            // время жизни токена
            }
        }),
        forwardRef(() => ProfileModule)         //  чтобы использовать ProfileService в AuthService, forwardRef - чтобы предотвратить кольцевую зависимость
    ],
    exports: [
        AuthService,                 // чтобы переиспользовать AuthService (через AuthModule) в UserModule->UserService и в ProfileModule->ProfileService
        JwtModule
    ]
})
export class AuthModule {
}
