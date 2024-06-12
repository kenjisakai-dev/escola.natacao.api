import { Body, Controller, Post } from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('api/v1/school/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() data: AuthLoginDTO) {
        return await this.authService.login(data);
    }
}
