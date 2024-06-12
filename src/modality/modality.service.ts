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

    async create(modality: ModalityDTO) {
        const { descricao } = modality;

        const _modality = await this.prismaService.modalidade.findFirst({
            where: {
                descricao: descricao ?? '',
            },
        });

        if (_modality) {
            throw new BadRequestException('Modalidade já existente');
        }

        return await this.prismaService.modalidade.create({
            data: modality,
        });
    }

    async update(nome: string, modality: ModalityUpdateDTO) {
        const { cod_modalidade } = await this.findOne(nome ?? '');

        return await this.prismaService.modalidade.update({
            where: {
                cod_modalidade,
            },
            data: modality,
        });
    }

    async findOne(descricao: string) {
        const modality = await this.prismaService.modalidade.findFirst({
            where: {
                descricao: descricao ?? '',
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
