import { Module } from '@nestjs/common';
import { StateModule } from './state/state.module';
import { CityModule } from './city/city.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [StateModule, CityModule, StudentModule],
})
export class AppModule {}
