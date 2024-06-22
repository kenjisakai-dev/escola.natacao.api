import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TeamDTO, TeamUpdateDTO } from './dto/team.dto';
import { TeamService } from './team.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('team')
@UseGuards(AuthGuard)
@Controller('api/v1/school/team')
export class TeamController {
    constructor(private readonly teamService: TeamService) {}

    @Post('create')
    async create(@Body() data: TeamDTO) {
        return await this.teamService.create(data);
    }

    @Patch('update')
    async update(
        @Query('cod_turma') cod_turma: number,
        @Body() data: TeamUpdateDTO,
    ) {
        return await this.teamService.update(cod_turma, data);
    }

    @Get('findOne')
    async findOne(@Query('cod_turma') cod_turma: number) {
        return await this.teamService.findOne(cod_turma);
    }

    @Get('findAll')
    async findAll() {
        return await this.teamService.findAll();
    }
}
