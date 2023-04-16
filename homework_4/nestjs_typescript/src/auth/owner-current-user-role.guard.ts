// guard - ограничить доступ к определенным эндпоинтам
// разрешено, если id профиля пользователя и редактируемого профиля совпадают
// и указанным ролям

import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Reflector} from "@nestjs/core";

import {ProfileService} from "../profile/profile.service";
import {ROLE_KEY} from "./role-auth.decorator";


@Injectable()           // чтобы класс стал провайдером
export class OwnerCurrentUserRoleGuard implements CanActivate {

    constructor(private jwtService: JwtService,     // JwtService идет вместе в Jwt модулем
                private profileService: ProfileService,
                private reflector: Reflector) {         // чтобы получить роли

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            let profileIsCorrect: boolean = false;
            let roleIsCorrect: boolean = false;

            const req = context.switchToHttp().getRequest()   // получаем request

            const authHeader = req.headers.authorization;       // получаем header авторизации (тип токена и сам токен)
            if (!authHeader) {    // если с клиента пришел пустой header authorization
                throw new UnauthorizedException({
                    message: 'Пользователь не авторизован'
                })
            }
            // тип токена и сам токен
            const bearer = authHeader.split(' ')[0]
            const token = authHeader.split(' ')[1]
            if (bearer !== 'Bearer' || !token) {    // если с клиента пришел пустой header authorization
                throw new UnauthorizedException({
                    message: 'Пользователь не авторизован'
                })
            }
            // проверяем, что текущий юзер редактирует свой профиль

            const user = this.jwtService.verify(token)   // раскодируем токен
            req.user = user;      // помещаем юзера в request
            // получаем профиль по user id
            const profileCurrentUser = await this.profileService.getProfileByUserId(user.id)
            if (profileCurrentUser) {
                // получаем id редактируемого профиля
                const profileIdEdit = req.params.profileId
                if (profileIdEdit == profileCurrentUser.dataValues.id) {
                    profileIsCorrect = true;
                }
            }

            // проверяем на соответствие роли

            // получаем роли (массив)
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
                context.getHandler(),
                context.getClass(),
            ])
            if (!requiredRoles) {       // если ролей нет, ф-ция будет доступна всем юзерам
                roleIsCorrect = true;
            }
            // обращается к ролям, кот. внутри токена,
            // проверяем, есть ли роль юзера в списке разрешенных для эндпоинта ролей
            roleIsCorrect = user.role.some(role => requiredRoles.includes(role.value));

            if (profileIsCorrect != true && roleIsCorrect != true) {
                throw new HttpException(
                    'Нет доступа',
                    HttpStatus.FORBIDDEN        // статус нет доступа
                )
            }
            // возвращаем, если хоть одно верно
            return profileIsCorrect || roleIsCorrect;

        } catch (e) {
            console.log(e)
            throw e
        }
    }
}
