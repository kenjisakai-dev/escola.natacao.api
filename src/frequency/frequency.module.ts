import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FrequencyController } from './frequency.controller';
import { FrequencyService } from './frequency.service';
import { RegistrationModule } from '../matricula/registration.module';

@Module({
    imports: [PrismaModule, RegistrationModule],
    controllers: [FrequencyController],
    providers: [FrequencyService],
    exports: [FrequencyService],
})
export class FrequencyModule {}
