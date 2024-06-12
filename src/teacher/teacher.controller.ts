import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { TeacherDTO, TeacherUpdateDTO } from './dto/teacher.dto';
import { TeacherService } from './teacher.service';

@Controller('api/v1/school/teacher')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Post('create')
    async create(@Body() teacher: TeacherDTO) {
        return await this.teacherService.create(teacher);
    }

    @Patch('update')
    async update(
        @Body() teacher: TeacherUpdateDTO,
        @Query('nome') nome: string,
    ) {
        return await this.teacherService.update(nome, teacher);
    }

    @Get('findOne')
    async findOne(@Query('nome') nome: string) {
        return await this.teacherService.findOne(nome);
    }

    @Get('findAll')
    async findAll() {
        return await this.teacherService.findAll();
    }
}
