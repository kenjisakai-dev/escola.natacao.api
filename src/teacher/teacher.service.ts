import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TeacherDTO, TeacherUpdateDTO } from './dto/teacher.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { validateCPF } from '../helpers/cpf';

@Injectable()
export class TeacherService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: TeacherDTO) {
        const { nome, cpf, telefone, data_admissao } = data;

        await this.checkingCPF(cpf);

        return await this.prismaService.professor.create({
            data: {
                nome,
                cpf,
                telefone,
                data_admissao,
            },
        });
    }

    async update(cod_professor: number, data: TeacherUpdateDTO) {
        const { cpf } = data;

        await this.findOne(cod_professor);

        if (cpf) {
            await this.checkingCPF(cpf);
        }

        return await this.prismaService.professor.update({
            where: {
                cod_professor,
            },
            data: data,
        });
    }

    async findOne(cod_professor: number) {
        const teacher = await this.prismaService.professor.findFirst({
            where: {
                cod_professor,
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
