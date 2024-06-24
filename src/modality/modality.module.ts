import { Module } from '@nestjs/common';
import { ModalityController } from './modality.controller';
import { ModalityService } from './modality.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
    imports: [PrismaModule, AuthModule, EmployeeModule],
    controllers: [ModalityController],
    providers: [ModalityService],
    exports: [ModalityService],
})
export class ModalityModule {}
