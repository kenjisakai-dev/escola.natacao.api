import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { ClassDTO } from './dto/class.dto';
import { ClassService } from './class.service';
import { ClassUpdateDTO } from './dto/class-update.dto';

@Controller('api/v1/school/class')
export class ClassController {
    constructor(private readonly classService: ClassService) {}

    @Post('create')
    async create(@Body() data: ClassDTO) {
        return await this.classService.create(data);
    }

    @Patch('update')
    async update(
        @Query('cod_turma') cod_turma: number,
        @Body() data: ClassUpdateDTO,
    ) {
        return await this.classService.update(cod_turma, data);
    }

    @Get('findOne')
    async findOne(@Query('cod_turma') cod_turma: number) {
        return await this.classService.findOne(cod_turma);
    }

    @Get('findAll')
    async findAll() {
        return await this.classService.findAll();
    }
}
