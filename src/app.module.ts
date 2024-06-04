import { Module } from '@nestjs/common';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({
    imports: [StudentModule, TeacherModule],
})
export class AppModule {}
