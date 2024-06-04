import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ModalityModule } from './modality/modality.module';

@Module({
    imports: [StudentModule, TeacherModule, ModalityModule],
})
export class AppModule {}
