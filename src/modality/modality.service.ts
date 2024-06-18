import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ModalityDTO, ModalityUpdateDTO } from './dto/modality.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModalityService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: ModalityDTO) {
        const { descricao = '' } = data;

        const modality = await this.prismaService.modalidade.findFirst({
            where: {
                descricao,
            },
        });

        if (modality) {
            throw new BadRequestException('Modalidade já existente');
        }

        return await this.prismaService.modalidade.create({
            data: data,
        });
    }

    async update(cod_modalidade: number, data: ModalityUpdateDTO) {
        await this.findOne(cod_modalidade);

        const { descricao = '' } = data;

        const modality = await this.prismaService.modalidade.findFirst({
            where: {
                descricao,
            },
        });

        if (modality) {
            throw new BadRequestException('Modalidade já existente');
        }

        return await this.prismaService.modalidade.update({
            where: {
                cod_modalidade,
            },
            data: data,
        });
    }

    async findOne(cod_modalidade: number) {
        const modality = await this.prismaService.modalidade.findFirst({
            where: {
                cod_modalidade,
            },
        });

        if (!modality) {
            throw new NotFoundException('Modalidade não encontrada');
        }

        return modality;
    }

    async findAll() {
        const modalities = await this.prismaService.modalidade.findMany();

        if (modalities.length === 0) {
            throw new NotFoundException('Não existe modalidades cadastradas');
        }

        return modalities;
    }
}
