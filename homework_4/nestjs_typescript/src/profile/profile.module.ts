// координирует составляющие

import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ProfileController} from './profile.controller';
import {ProfileService} from './profile.service';
import {User} from "../user/user.model";
import {Profile} from "./profile.model";
import {AuthModule} from "../auth/auth.module";

@Module({
    controllers: [ProfileController],
    providers: [ProfileService],        // чтобы в контроллере использовать логику
    imports: [
        SequelizeModule.forFeature([User, Profile]),     // чтобы использовать модели в ProfileService
        forwardRef(() => AuthModule)                        // чтобы использовать AuthService в ProfileService, forwardRef - чтобы предотвратить кольцевую зависимость
    ],
    exports: [
        ProfileService,              // чтобы использовать (через ProfileModule) в AuthModule->AuthService и в auth guard
    ]
})
export class ProfileModule {
}
