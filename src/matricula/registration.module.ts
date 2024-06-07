import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClassModule } from '../class_/class.module';
import { StudentModule } from '../student/student.module';

@Module({
    imports: [PrismaModule, ClassModule, StudentModule],
    controllers: [RegistrationController],
    providers: [RegistrationService],
    exports: [RegistrationService],
})
export class RegistrationModule {}
