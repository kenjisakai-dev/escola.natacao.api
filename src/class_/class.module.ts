import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ModalityTeacherModule } from '../modality-teacher/modality-teacher.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, ModalityTeacherModule, AuthModule],
    controllers: [ClassController],
    providers: [ClassService],
    exports: [ClassService],
})
export class ClassModule {}
