import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { RegistrationDTO, RegistrationUpdateDTO } from './dto/registration.dto';
import { RegistrationService } from './registration.service';

@Controller('api/v1/school/registration')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post('create')
    async create(@Body() registration: RegistrationDTO) {
        return await this.registrationService.create(registration);
    }

    @Patch('update')
    async update(
        @Query('cod_matricula') cod_matricula: number,
        @Body() registration: RegistrationUpdateDTO,
    ) {
        return await this.registrationService.update(
            cod_matricula,
            registration,
        );
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
