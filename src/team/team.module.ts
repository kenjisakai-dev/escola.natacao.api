import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ModalityTeacherModule } from '../modality-teacher/modality-teacher.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, ModalityTeacherModule, AuthModule],
    controllers: [TeamController],
    providers: [TeamService],
    exports: [TeamService],
})
export class TeamModule {}
