import { Body, Controller, Get, Post } from '@nestjs/common';
import { StateService } from './state.service';
import { StateDTO } from './state.dto';

@Controller('api/v1/school/state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post('create')
  async create(@Body() state: StateDTO) {
    return await this.stateService.create(state);
  }

  @Get('findAll')
  async findAll() {
    return await this.stateService.findAll();
  }
}
