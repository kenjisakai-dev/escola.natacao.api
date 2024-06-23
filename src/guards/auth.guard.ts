import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly employeeService: EmployeeService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();

            if (request.originalUrl.match('employee/create')) {
                const employees = await this.employeeService.existingEmployee();
                if (employees.length === 0) {
                    request.employee = { permissao: 2 };
                    return true;
                }
            }

            const { authorization } = request.headers;

            const token = authorization.replace('Bearer ', '');

            const payload = await this.authService.checkToken(token);

            request.employee = payload;

            return true;
        } catch (err) {
            throw new ForbiddenException('Token Inválido');
        }
    }
}
