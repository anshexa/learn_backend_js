// guard - ограничить доступ к определенным эндпоинтам
// запрещаем, если не авторизован

import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";

@Injectable()           // чтобы класс стал провайдером
export class JwtAuthGuard implements CanActivate {

    constructor(private jwtService: JwtService) {       // JwtService идет вместе в Jwt модулем
    }

    // когда возвращает false - доступ запрещен, true - разрешен
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest()   // получаем request
        try {
            // получаем header авторизации (тип токена и сам токен)
            const authHeader = req.headers.authorization;
            // тип токена и сам токен
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]

            if (bearer !== 'Bearer' || !token) {    // если с клиента пришел пустой header authorization
                throw new UnauthorizedException({
                    message: 'Пользователь не авторизован'
                })
            }

            const user = this.jwtService.verify(token)   // раскодируем токен
            req.user = user;      // помещаем юзера в request
            return true;
        } catch (e) {
            console.log(e)
            throw new UnauthorizedException({
                message: 'Пользователь не авторизован'
            })
        }
    }
}
