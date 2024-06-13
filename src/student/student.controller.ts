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
    async update(
        @Query('cod_aluno') cod_aluno: number,
        @Body() data: StudentUpdateDTO,
    ) {
        return await this.studentService.update(cod_aluno, data);
    }

    @Get('findOne')
    async findOne(@Query('cod_aluno') cod_aluno: number) {
        return await this.studentService.findOne(cod_aluno);
    }

    @Get('findAll')
    async findAll() {
        return await this.studentService.findAll();
    }
}
