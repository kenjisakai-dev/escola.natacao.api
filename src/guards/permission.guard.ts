import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
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

        return permissions.some(
            (permission) => permission === employee?.permissao,
        );
    }
}
