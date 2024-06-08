import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { FrequencyDTO } from './dto/frequency.dto';
import { FrequencyService } from './frequency.service';
import { FrequencyUpdateDTO } from './dto/frequency-update.dto';

@Controller('api/v1/school/frequency')
export class FrequencyController {
    constructor(private readonly frequencyService: FrequencyService) {}

    @Post('create')
    async create(@Body() frequency: FrequencyDTO) {
        return await this.frequencyService.create(frequency);
    }

    @Patch('update')
    async update(
        @Query('cod_frequencia') cod_frequencia: number,
        @Body() frequency: FrequencyUpdateDTO,
    ) {
        return await this.frequencyService.update(cod_frequencia, frequency);
    }

    @Get('findOne')
    async findOne(@Query('cod_frequencia') cod_frequencia: number) {
        return await this.frequencyService.findOne(cod_frequencia);
    }

    @Get('findAll')
    async findAll() {
        return await this.frequencyService.findAll();
    }
}
