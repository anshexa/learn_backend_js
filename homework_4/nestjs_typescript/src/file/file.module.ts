// координирует составляющие

import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {FileService} from './file.service';
import {FileController} from './file.controller';
import {File} from "./file.model";

@Module({
    controllers: [FileController],
    providers: [FileService],
    imports:[
        SequelizeModule.forFeature([File]),      // чтобы использовать модели в FileService
    ],
    exports: [
        FileService                 // чтобы использовать (через FileModule) в TextblockModule->TextblockService
    ]
})
export class FileModule {
}
