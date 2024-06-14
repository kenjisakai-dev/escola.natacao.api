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

    async create(data: RegistrationDTO) {
        const { cod_turma, cod_aluno } = data;

        await this.classService.findOne(cod_turma);
        await this.studentService.findOne(cod_aluno);

        return await this.prismaService.matricula.create({
            data,
        });
    }

    async update(cod_matricula: number, data: RegistrationUpdateDTO) {
        const { cod_turma, cod_aluno } = data;

        await this.findOne(cod_matricula);

        if (cod_aluno) {
            await this.studentService.findOne(cod_aluno);
        }

        if (cod_turma) {
            await this.classService.findOne(cod_turma);
        }

        return await this.prismaService.matricula.update({
            where: {
                cod_matricula,
            },
            data,
        });
    }

    async findOne(cod_matricula: number) {
        const registration = await this.prismaService.matricula.findUnique({
            where: {
                cod_matricula,
            },
        });

        if (!registration) {
            throw new NotFoundException('Matricula não encontrada');
        }

        return registration;
    }

    async findAll() {
        const registrations = await this.prismaService.matricula.findMany();

        if (registrations.length === 0) {
            throw new NotFoundException('Não existe matriculas cadastradas');
        }

        return registrations;
    }
}
