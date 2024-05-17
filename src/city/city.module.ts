import { Module } from '@nestjs/common';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StateModule } from '../state/state.module';

@Module({
  imports: [PrismaModule, StateModule],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
