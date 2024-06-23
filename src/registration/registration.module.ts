import { Module } from '@nestjs/common';
import { RegistrationController } from './registration.controller';
import { RegistrationService } from './registration.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StudentModule } from '../student/student.module';
import { AuthModule } from '../auth/auth.module';
import { TeamModule } from '../team/team.module';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
    imports: [
        PrismaModule,
        TeamModule,
        StudentModule,
        AuthModule,
        EmployeeModule,
    ],
    controllers: [RegistrationController],
    providers: [RegistrationService],
    exports: [RegistrationService],
})
export class RegistrationModule {}
