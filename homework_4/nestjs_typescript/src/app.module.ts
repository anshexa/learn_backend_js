// точка запуска приложения
// главный модуль, объединяет подмодули

import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import {ConfigModule} from "@nestjs/config";
import {ServeStaticModule} from "@nestjs/serve-static";

import * as path from "node:path";

import {UserModule} from './user/user.module';
import {User} from "./user/user.model";
import {RoleModule} from './role/role.module';
import {Role} from "./role/role.model";
import {UserRole} from "./role/user-role.model";
import {AuthModule} from './auth/auth.module';
import {ProfileModule} from './profile/profile.module';
import {Profile} from "./profile/profile.model";
import {TextblockModule} from './textblock/textblock.module';
import {Textblock} from "./textblock/textblock.model";
import {FileModule} from './file/file.module';
import {File} from "./file/file.model";


@Module({       // предоставляет метаданные, которые Nest использует для организации структуры приложения
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`     // путь до файла конфигурации, NODE_ENV - задано в package.json при запуске
        }),
        SequelizeModule.forRoot({       // ORM Sequelize
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRES_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Role, UserRole, Profile, Textblock, File],     // классы/модели по которым создаются таблицы в бд
            autoLoadModels: true    // чтобы создавались табл в бд на основании моделей, которые будем создавать
        }),
        ServeStaticModule.forRoot({                 // чтобы сервер раздавал статику, изображения
            rootPath: path.resolve(__dirname, 'static'),    // путь до папки со статикой
        }),
        UserModule,    // подмодуль
        RoleModule,     // подмодуль
        AuthModule,      // подмодуль
        ProfileModule,      // подмодуль
        TextblockModule,     // подмодуль
        FileModule,         // подмодуль
    ]

})
export class AppModule {
}
