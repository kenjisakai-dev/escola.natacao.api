import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { StudentDTO, StudentUpdateDTO } from './dto/student.dto';
import { StudentService } from './student.service';

@Controller('api/v1/school/student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post('create')
    async create(@Body() student: StudentDTO) {
        return await this.studentService.create(student);
    }

    @Patch('update')
    async update(
        @Body() student: StudentUpdateDTO,
        @Query('nome') nome: string,
    ) {
        return await this.studentService.update(nome, student);
    }

    @Get('findOne')
    async findOne(@Query('nome') nome: string) {
        return await this.studentService.findOne(nome);
    }

    @Get('findAll')
    async findAll() {
        return await this.studentService.findAll();
    }
}
