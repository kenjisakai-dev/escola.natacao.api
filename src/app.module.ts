import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ModalityModule } from './modality/modality.module';
import { ModalityTeacherModule } from './modality-teacher/modality-teacher.module';
import { ClassModule } from './class_/class.module';
import { RegistrationModule } from './matricula/registration.module';
import { FrequencyModule } from './frequency/frequency.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
    imports: [
        StudentModule,
        TeacherModule,
        ModalityModule,
        ModalityTeacherModule,
        ClassModule,
        RegistrationModule,
        FrequencyModule,
        AuthModule,
        EmployeeModule,
    ],
})
export class AppModule {}
