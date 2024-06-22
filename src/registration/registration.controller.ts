import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { RegistrationDTO, RegistrationUpdateDTO } from './dto/registration.dto';
import { RegistrationService } from './registration.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('registration')
@UseGuards(AuthGuard)
@Controller('api/v1/school/registration')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post('create')
    async create(@Body() data: RegistrationDTO) {
        return await this.registrationService.create(data);
    }

    @Patch('update')
    async update(
        @Query('cod_matricula') cod_matricula: number,
        @Body() data: RegistrationUpdateDTO,
    ) {
        return await this.registrationService.update(cod_matricula, data);
    }

    @Get('findOne')
    async findOne(@Query('cod_matricula') cod_matricula: number) {
        return await this.registrationService.findOne(cod_matricula);
    }

    @Get('findAll')
    async findAll() {
        return await this.registrationService.findAll();
    }
}
