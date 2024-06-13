import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ModalityTeacherDTO } from './dto/modality-teacher.dto';
import { TeacherService } from '../teacher/teacher.service';
import { ModalityService } from '../modality/modality.service';

@Injectable()
export class ModalityTeacherService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly teacherService: TeacherService,
        private readonly modalityService: ModalityService,
    ) {}

    async create(data: ModalityTeacherDTO) {
        const { cod_professor, cod_modalidade } = data;

        await this.teacherService.findOne(cod_professor);
        await this.modalityService.findOne(cod_modalidade);

        const modality =
            await this.prismaService.modalidade_professor.findFirst({
                where: {
                    cod_professor,
                    cod_modalidade,
                },
            });

        if (modality) {
            throw new BadRequestException(
                'O professor já está vinculado na modalidade',
            );
        }

        return await this.prismaService.modalidade_professor.create({
            data: {
                cod_professor,
                cod_modalidade,
            },
        });
    }

    async findOne(cod_modalidade_professor: number) {
        const modality =
            await this.prismaService.modalidade_professor.findUnique({
                where: {
                    cod_modalidade_professor,
                },
            });

        if (!modality) {
            throw new NotFoundException(
                'Registro do professor na Modalidade não encontrado',
            );
        }

        return modality;
    }

    async findAll() {
        const modalities =
            await this.prismaService.modalidade_professor.findMany();

        if (modalities.length === 0) {
            throw new NotFoundException(
                'Não existe professores cadastrados nas modalidades',
            );
        }

        return modalities;
    }
}
