import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { TeamDTO, TeamUpdateDTO } from './dto/team.dto';
import { ModalityTeacherService } from '../modality-teacher/modality-teacher.service';

@Injectable()
export class TeamService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly modalityTeacher: ModalityTeacherService,
    ) {}

    async create(data: TeamDTO) {
        const { cod_modalidade_professor } = data;

        await this.modalityTeacher.findOne(cod_modalidade_professor);

        return await this.prismaService.turma.create({
            data,
        });
    }

    async update(cod_turma: number, data: TeamUpdateDTO) {
        const { cod_modalidade_professor } = data;

        if (cod_modalidade_professor) {
            await this.modalityTeacher.findOne(cod_modalidade_professor);
        }

        return await this.prismaService.turma.update({
            where: {
                cod_turma,
            },
            data,
        });
    }

    async findOne(cod_turma: number) {
        const result = await this.prismaService.turma.findUnique({
            where: {
                cod_turma,
            },
        });

        if (!result) {
            throw new NotFoundException('Turma não encontrada');
        }

        return result;
    }

    async findAll() {
        const result = await this.prismaService.turma.findMany();

        if (result.length === 0) {
            throw new NotFoundException('Não existe turmas cadastradas');
        }

        return result;
    }
}
