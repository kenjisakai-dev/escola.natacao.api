import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ModalityTeacherDTO } from './dto/modality-teacher.dto';
import { TeacherService } from '../teacher/teacher.service';
import { ModalityService } from '../modality/modality.service';
import { modalidade_professor } from '@prisma/client';

@Injectable()
export class ModalityTeacherService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly teacherService: TeacherService,
        private readonly modalityService: ModalityService,
    ) {}

    async create(modalityTeacher: ModalityTeacherDTO) {
        const { professor, modalidade } = modalityTeacher;

        const { cod_professor } = await this.teacherService.findOne(professor);
        const { cod_modalidade } =
            await this.modalityService.findOne(modalidade);

        const _modalityTeacher =
            await this.prismaService.modalidade_professor.findFirst({
                where: {
                    cod_professor,
                    cod_modalidade,
                },
            });

        if (_modalityTeacher) {
            throw new BadRequestException(
                'Relacionamento modalidade professor já existente',
            );
        }

        return await this.prismaService.modalidade_professor.create({
            data: {
                cod_professor,
                cod_modalidade,
            },
        });
    }

    async findOne(modalidade: string, professor: string) {
        let modalitiesTeachers: modalidade_professor[];
        let cod_modalidade: number;
        let cod_professor: number;

        if (modalidade) {
            cod_modalidade = (await this.modalityService.findOne(modalidade))
                .cod_modalidade;
        }

        if (professor) {
            cod_professor = (await this.teacherService.findOne(professor))
                .cod_professor;
        }

        if (modalidade && professor) {
            modalitiesTeachers =
                await this.prismaService.modalidade_professor.findMany({
                    where: {
                        cod_modalidade,
                        cod_professor,
                    },
                });
        } else {
            modalitiesTeachers =
                await this.prismaService.modalidade_professor.findMany({
                    where: {
                        OR: [
                            {
                                cod_professor,
                            },
                            {
                                cod_modalidade,
                            },
                        ],
                    },
                });
        }

        if (modalitiesTeachers.length === 0) {
            throw new NotFoundException(
                'Relacionamento modalidade professor não encontrado',
            );
        }

        return modalitiesTeachers;
    }

    async findAll() {
        const modalities_teachers =
            await this.prismaService.modalidade_professor.findMany();

        if (modalities_teachers.length === 0) {
            throw new NotFoundException(
                'Não existe modalidades e professores cadastrados',
            );
        }

        return modalities_teachers;
    }
}
