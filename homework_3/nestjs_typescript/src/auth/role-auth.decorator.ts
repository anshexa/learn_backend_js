import {SetMetadata} from "@nestjs/common";

export const ROLE_KEY = 'role'  // получать по ключу метданные внутри guard

// будет декоратором, принимает массив ролей
export const Roles = (...roles: string[]) => SetMetadata(ROLE_KEY, roles);
