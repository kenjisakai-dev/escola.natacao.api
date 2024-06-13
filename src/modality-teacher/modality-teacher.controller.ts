import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ModalityTeacherService } from './modality-teacher.service';
import { ModalityTeacherDTO } from './dto/modality-teacher.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/v1/school/modality/teacher')
export class ModalityTeacherController {
    constructor(
        private readonly modalityTeacherService: ModalityTeacherService,
    ) {}

    @Post('create')
    async create(@Body() data: ModalityTeacherDTO) {
        return await this.modalityTeacherService.create(data);
    }

    @Get('findOne')
    async findOne(
        @Query('cod_modalidade_professor') cod_modalidade_professor: number,
    ) {
        return await this.modalityTeacherService.findOne(
            cod_modalidade_professor,
        );
    }

    @Get('findAll')
    async findAll() {
        return await this.modalityTeacherService.findAll();
    }
}
