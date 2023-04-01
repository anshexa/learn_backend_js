// координирует составляющие

import {forwardRef, Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {UserController} from './user.controller';
import {UserService} from './user.service';
import {User} from "./user.model";
import {Role} from "../role/role.model";
import {UserRole} from "../role/user-role.model";
import {RoleModule} from "../role/role.module";
import {AuthModule} from "../auth/auth.module";
import {Profile} from "../profile/profile.model";

@Module({
    controllers: [UserController],
    providers: [UserService],      // чтобы в контроллере использовать логику
    imports: [
        SequelizeModule.forFeature([User, Role, UserRole, Profile]),     // чтобы использовать модели в UserService
        RoleModule,                                                    // чтобы использовать в UserService
        forwardRef(() => AuthModule)                                // чтобы использовать в UserService, forwardRef - чтобы предотвратить кольцевую зависимость
    ],
    exports: [
        UserService            // чтобы использовать (через UserModule) в AuthModule->AuthService
    ]
})
export class UserModule {
}
