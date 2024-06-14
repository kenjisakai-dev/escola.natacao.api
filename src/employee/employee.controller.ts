import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeDTO, EmployeeUpdateDTO } from './dto/employee.dto';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('api/v1/school/employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) {}

    @Post('create')
    async create(@Body() data: EmployeeDTO) {
        return await this.employeeService.create(data);
    }

    @Patch('update')
    async update(
        @Query('cod_funcionario') cod_funcionario: number,
        @Body() data: EmployeeUpdateDTO,
    ) {
        return await this.employeeService.update(cod_funcionario, data);
    }

    @Get('findOne')
    async findOne(@Query('cod_funcionario') cod_funcionario: number) {
        return await this.employeeService.findOne(cod_funcionario);
    }

    @Get('findAll')
    async findAll() {
        return await this.employeeService.findAll();
    }
}
