import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { StudentDTO, StudentUpdateDTO } from './dto/student.dto';
import { StudentService } from './student.service';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/v1/school/student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post('create')
    async create(@Body() data: StudentDTO) {
        return await this.studentService.create(data);
    }

    @Patch('update')
    async update(@Query('nome') nome: string, @Body() data: StudentUpdateDTO) {
        return await this.studentService.update(nome, data);
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
