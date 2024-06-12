import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { config } from '../config/environment';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule, JwtModule.register({ secret: config.jwt_secret })],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
