import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ModalityDTO, ModalityUpdateDTO } from './dto/modality.dto';
import { ModalityService } from './modality.service';

@Controller('api/v1/school/modality')
export class ModalityController {
    constructor(private readonly modalityService: ModalityService) {}

    @Post('create')
    async create(@Body() data: ModalityDTO) {
        return await this.modalityService.create(data);
    }

    @Patch('update')
    async update(
        @Body() data: ModalityUpdateDTO,
        @Query('cod_modalidade') cod_modalidade: number,
    ) {
        return await this.modalityService.update(cod_modalidade, data);
    }

    @Get('findOne')
    async findOne(@Query('cod_modalidade') cod_modalidade: number) {
        return await this.modalityService.findOne(cod_modalidade);
    }

    @Get('findAll')
    async findAll() {
        return await this.modalityService.findAll();
    }
}
