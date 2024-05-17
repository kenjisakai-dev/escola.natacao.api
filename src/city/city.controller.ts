import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CityService } from './city.service';
import { CityDTO } from './city.dto';

@Controller('api/v1/school/city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post('create')
  async create(@Body() city: CityDTO) {
    return await this.cityService.create(city);
  }

  @Get('findOne')
  async findOne(@Query('cidade') cidade: string) {
    return await this.cityService.findOne(cidade);
  }

  @Get('findAll')
  async findAll() {
    return await this.cityService.findAll();
  }
}
