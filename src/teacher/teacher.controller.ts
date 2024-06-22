import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TeacherDTO, TeacherUpdateDTO } from './dto/teacher.dto';
import { TeacherService } from './teacher.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('teacher')
@UseGuards(AuthGuard)
@Controller('api/v1/school/teacher')
export class TeacherController {
    constructor(private readonly teacherService: TeacherService) {}

    @Post('create')
    async create(@Body() teacher: TeacherDTO) {
        return await this.teacherService.create(teacher);
    }

    @Patch('update')
    async update(
        @Body() data: TeacherUpdateDTO,
        @Query('cod_professor') cod_professor: number,
    ) {
        return await this.teacherService.update(cod_professor, data);
    }

    @Get('findOne')
    async findOne(@Query('cod_professor') cod_professor: number) {
        return await this.teacherService.findOne(cod_professor);
    }

    @Get('findAll')
    async findAll() {
        return await this.teacherService.findAll();
    }
}
