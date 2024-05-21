import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StateModule } from '../state/state.module';
import { CityModule } from '../city/city.module';

@Module({
  imports: [PrismaModule, StateModule, CityModule],
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
