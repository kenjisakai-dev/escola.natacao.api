import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { FrequencyDTO, FrequencyUpdateDTO } from './dto/frequency.dto';
import { FrequencyService } from './frequency.service';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/v1/school/frequency')
export class FrequencyController {
    constructor(private readonly frequencyService: FrequencyService) {}

    @Post('create')
    async create(@Body() data: FrequencyDTO) {
        return await this.frequencyService.create(data);
    }

    @Patch('update')
    async update(
        @Query('cod_frequencia') cod_frequencia: number,
        @Body() data: FrequencyUpdateDTO,
    ) {
        return await this.frequencyService.update(cod_frequencia, data);
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
