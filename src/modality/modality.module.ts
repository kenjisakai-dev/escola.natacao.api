import { Module } from '@nestjs/common';
import { ModalityController } from './modality.controller';
import { ModalityService } from './modality.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule],
    controllers: [ModalityController],
    providers: [ModalityService],
    exports: [ModalityService],
})
export class ModalityModule {}
