import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClassModule } from '../class_/class.module';
import { StudentModule } from '../student/student.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, ClassModule, StudentModule, AuthModule],
    controllers: [RegistrationController],
    providers: [RegistrationService],
    exports: [RegistrationService],
})
export class RegistrationModule {}
