import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FrequencyController } from './frequency.controller';
import { FrequencyService } from './frequency.service';
import { AuthModule } from '../auth/auth.module';
import { RegistrationModule } from '../registration/registration.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
    imports: [PrismaModule, RegistrationModule, AuthModule, EmployeeModule],
    controllers: [FrequencyController],
    providers: [FrequencyService],
    exports: [FrequencyService],
})
export class FrequencyModule {}
