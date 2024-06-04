import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ModalityDTO } from './dto/modality.dto';
import { ModalityService } from './modality.service';
import { ModalityUpdateDTO } from './dto/modality-update.dto';

@Controller('api/v1/school/modality')
export class ModalityController {
    constructor(private readonly modalityService: ModalityService) {}

    @Post('create')
    async create(@Body() modality: ModalityDTO) {
        return await this.modalityService.create(modality);
    }

    @Patch('update')
    async update(
        @Body() modality: ModalityUpdateDTO,
        @Query('descricao') descricao: string,
    ) {
        return await this.modalityService.update(descricao, modality);
    }

    @Get('findOne')
    async findOne(@Query('descricao') descricao: string) {
        return await this.modalityService.findOne(descricao);
    }

    @Get('findAll')
    async findAll() {
        return await this.modalityService.findAll();
    }
}
