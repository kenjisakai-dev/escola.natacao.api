import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ModalityTeacherService } from './modality-teacher.service';
import {
    ModalityTeacherDTO,
    ModalityTeacherUpdateDTO,
} from './dto/modality-teacher.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('modalityTeacher')
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

    @Patch('update')
    async update(
        @Query('cod_modalidade_professor') cod_modalidade_professor: number,
        @Body() data: ModalityTeacherUpdateDTO,
    ) {
        return await this.modalityTeacherService.update(
            cod_modalidade_professor,
            data,
        );
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
