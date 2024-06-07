import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TeacherDTO } from './dto/teacher.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { validateCPF } from '../helpers/cpf';
import { TeacherUpdateDTO } from './dto/teacher-update.dto';

@Injectable()
export class TeacherService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(teacher: TeacherDTO) {
        const { cpf, data_admissao } = teacher;

        await this.checkingCPF(cpf);

        return await this.prismaService.professor.create({
            data: {
                ...teacher,
                data_admissao: data_admissao ?? new Date(),
            },
        });
    }

    async update(nome: string, teacher: TeacherUpdateDTO) {
        const { cpf } = teacher;

        if (cpf) {
            await this.checkingCPF(cpf);
        }

        const { cod_professor } = await this.findOne(nome ?? '');

        return await this.prismaService.professor.update({
            where: {
                cod_professor,
            },
            data: teacher,
        });
    }

    async findOne(nome: string) {
        const teacher = await this.prismaService.professor.findFirst({
            where: {
                nome: nome ?? '',
            },
        });

        if (!teacher) {
            throw new NotFoundException('Professor não encontrado');
        }

        return teacher;
    }

    async findAll() {
        const teachers = await this.prismaService.professor.findMany();

        if (teachers.length === 0) {
            throw new NotFoundException('Não existe professores cadastrados');
        }

        return teachers;
    }

    async checkingCPF(cpf: string) {
        const { valid } = await validateCPF(cpf);

        if (!valid) {
            throw new BadRequestException('CPF inválido');
        }

        const data = await this.prismaService.professor.findFirst({
            where: {
                cpf,
            },
        });

        if (data) {
            throw new BadRequestException('CPF já cadastrado');
        }
    }
}
