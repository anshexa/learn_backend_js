// guard - ограничить доступ к определенным эндпоинтам
// ограничиваем для определенных ролей


import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {Observable} from "rxjs";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";

import {ROLE_KEY} from "./role-auth.decorator";

@Injectable()           // чтобы класс стал провайдером
export class RoleGuard implements CanActivate {

    constructor(private jwtService: JwtService,         // JwtService идет вместе в Jwt модулем
                private reflector: Reflector) {         // чтобы получить роли
    }

    // когда возвращает false - доступ запрещен, true - разрешен
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            // получаем роли (массив)
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            if (!requiredRoles) {       // если ролей нет, ф-ция будет доступна всем польз-лям
                return true;
            }
            const req = context.switchToHttp().getRequest()   // получаем request
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
            // обращается к ролям, кот. внутри токена,
            // проверяем, есть ли роль польз-ля в списке разрешенных для эндпоинта ролей
            return user.role.some(role => requiredRoles.includes(role.value));
        } catch (e) {
            console.log(e)
            throw new HttpException(
                'Нет доступа',
                HttpStatus.FORBIDDEN        // статус нет доступа
            )
        }
    }
}
