import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ModalityTeacherController } from './modality-teacher.controller';
import { ModalityTeacherService } from './modality-teacher.service';
import { TeacherModule } from '../teacher/teacher.module';
import { ModalityModule } from '../modality/modality.module';
import { AuthModule } from '../auth/auth.module';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
    imports: [
        PrismaModule,
        TeacherModule,
        ModalityModule,
        AuthModule,
        EmployeeModule,
    ],
    controllers: [ModalityTeacherController],
    providers: [ModalityTeacherService],
    exports: [ModalityTeacherService],
})
export class ModalityTeacherModule {}
