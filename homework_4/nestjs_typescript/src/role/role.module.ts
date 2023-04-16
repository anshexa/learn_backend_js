// координирует составляющие

import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {RoleService} from './role.service';
import {RoleController} from './role.controller';
import {Role} from "./role.model";
import {User} from "../user/user.model";
import {UserRole} from "./user-role.model";

@Module({
    controllers: [RoleController],
    providers: [RoleService],       // чтобы в контроллере использовать логику
    imports: [
        SequelizeModule.forFeature([Role, User, UserRole])      // чтобы использовать модели в RoleService
    ],
    exports: [
        RoleService        // чтобы использовать (через RoleModule) в UserModule->UserService
    ]
})
export class RoleModule {
}
