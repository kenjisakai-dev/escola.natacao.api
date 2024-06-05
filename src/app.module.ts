import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ModalityModule } from './modality/modality.module';
import { ModalityTeacherModule } from './modality-teacher/modality-teacher.module';

@Module({
    imports: [
        StudentModule,
        TeacherModule,
        ModalityModule,
        ModalityTeacherModule,
    ],
})
export class AppModule {}
