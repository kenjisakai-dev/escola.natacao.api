import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RegistrationDTO, RegistrationUpdateDTO } from './dto/registration.dto';
import { ClassService } from '../class_/class.service';
import { StudentService } from '../student/student.service';

@Injectable()
export class RegistrationService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly classService: ClassService,
        private readonly studentService: StudentService,
    ) {}

    async create(registration: RegistrationDTO) {
        const { data, cod_turma, aluno } = registration;

        await this.classService.findOne(cod_turma);
        const { cod_aluno } = await this.studentService.findOne(aluno);

        return await this.prismaService.matricula.create({
            data: {
                data: data ?? new Date(),
                cod_turma,
                cod_aluno,
            },
        });
    }

    async update(cod_matricula: number, registration: RegistrationUpdateDTO) {
        let cod_aluno: number;

        const { data, aluno, cod_turma } = registration;

        await this.findOne(cod_matricula);

        if (aluno) {
            cod_aluno = (await this.studentService.findOne(aluno)).cod_aluno;
        }

        if (cod_turma) {
            await this.classService.findOne(cod_turma);
        }

        return await this.prismaService.matricula.update({
            where: {
                cod_matricula,
            },
            data: {
                data,
                cod_turma,
                cod_aluno,
            },
        });
    }

    async findOne(cod_matricula: number) {
        const result = await this.prismaService.matricula.findUnique({
            where: {
                cod_matricula,
            },
        });

        if (!result) {
            throw new NotFoundException('Matricula não encontrada');
        }

        return result;
    }

    async findAll() {
        const result = await this.prismaService.matricula.findMany();

        if (result.length === 0) {
            throw new NotFoundException('Não existe matriculas cadastradas');
        }

        return result;
    }
}
