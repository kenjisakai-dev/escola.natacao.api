import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../employee/decorator/permissions.decorator';
import { Permission } from '../employee/enum/permission.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const permissions = this.reflector.getAllAndOverride<Permission[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()],
        );
        if (!permissions) {
            return true;
        }
        const { employee } = context.switchToHttp().getRequest();

        const permission = permissions.some(
            (permission) => permission === employee?.permissao,
        );

        if (!permission) throw new ForbiddenException('Acesso não autorizado');

        return true;
    }
}
