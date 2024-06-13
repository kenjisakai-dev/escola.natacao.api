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

    async create(modalityTeacher: ModalityTeacherDTO) {
        const { cod_professor, modalidade } = modalityTeacher;

        await this.teacherService.findOne(cod_professor);
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
        const result = await this.prismaService.modalidade_professor.findUnique(
            {
                where: {
                    cod_modalidade_professor,
                },
            },
        );

        if (!result) {
            throw new NotFoundException(
                'Código da modalidade_professor não encontrado',
            );
        }

        return result;
    }

    async findAll() {
        const result = await this.prismaService.modalidade_professor.findMany();

        if (result.length === 0) {
            throw new NotFoundException(
                'Não existe professores cadastrados nas modalidades',
            );
        }

        return result;
    }
}
