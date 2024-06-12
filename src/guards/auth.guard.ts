import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const { authorization } = request.headers;

            const token = authorization.replace('Bearer ', '');

            const payload = await this.authService.checkToken(token);

            request.employee = payload;

            return true;
        } catch (err) {
            return false;
        }
    }
}
