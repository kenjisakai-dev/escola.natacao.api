import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ModalityModule } from './modality/modality.module';
import { ModalityTeacherModule } from './modality-teacher/modality-teacher.module';
import { TeamModule } from './team/team.module';
import { RegistrationModule } from './registration/registration.module';
import { FrequencyModule } from './frequency/frequency.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { EntrypointModule } from './entrypoint/entrypoint.module';

@Module({
    imports: [
        StudentModule,
        TeacherModule,
        ModalityModule,
        ModalityTeacherModule,
        TeamModule,
        RegistrationModule,
        FrequencyModule,
        AuthModule,
        EmployeeModule,
        EntrypointModule,
    ],
})
export class AppModule {}
