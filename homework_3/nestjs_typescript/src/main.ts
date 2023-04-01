// точка входа в приложение
import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

import {AppModule} from "./app.module";

async function start() {
    const PORT = process.env.PORT || 5000
    const app = await NestFactory.create(AppModule)     // создается приложение

    // документация
    const config = new DocumentBuilder()
        .setTitle('Проект nestJs + Typescript')
        .setDescription('Документация REST API')
        .setVersion('1.0.0')
        .addTag('REST API')
        .build()
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/docs', app, document)     // адрес, по которому можно увидеть документацию

    await app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}/`))    // запускается приложение
}

start()
