// координирует составляющие

import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {TextblockController} from './textblock.controller';
import {TextblockService} from './textblock.service';
import {Textblock} from "./textblock.model";
import {AuthModule} from "../auth/auth.module";
import {FileModule} from "../file/file.module";

@Module({
    controllers: [TextblockController],
    providers: [TextblockService],       // чтобы в контроллере использовать логику
    imports: [
        SequelizeModule.forFeature([Textblock]),      // чтобы использовать модели в TextblockService
        AuthModule,                                          // чтобы использовать JwtService для RoleGuard в TextblockService
        FileModule                                          // чтобы использовать в TextblockService
    ]
})
export class TextblockModule {
}
