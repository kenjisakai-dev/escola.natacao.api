import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ClassDTO } from './dto/class.dto';
import { ModalityTeacherService } from '../modality-teacher/modality-teacher.service';
import { ClassUpdateDTO } from './dto/class-update.dto';

@Injectable()
export class ClassService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly modalityTeacher: ModalityTeacherService,
    ) {}

    async create(data: ClassDTO) {
        const { cod_modalidade_professor } = data;

        await this.modalityTeacher.findOne(cod_modalidade_professor);

        return await this.prismaService.turma.create({
            data,
        });
    }

    async update(cod_turma: number, data: ClassUpdateDTO) {
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
