import { Injectable } from '@nestjs/common';
import { StateDTO } from './state.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StateService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(state: StateDTO) {
        const find = await this.prismaService.estado.findFirst({
            where: {
                nome: state.nome,
            },
        });

        if (find) {
            return { ...find, message: 'Estado já existente' };
        }

        return await this.prismaService.estado.create({ data: state });
    }

    async findOne(estado: string) {
        const state = await this.prismaService.estado.findUnique({
            where: {
                nome: estado,
            },
        });

        if (!state) {
            return { state: null, message: 'Estado não encontrado' };
        }

        return state;
    }

    async findAll() {
        const states = await this.prismaService.estado.findMany();

        if (states.length === 0) {
            return { states: [], message: 'Não existe estados cadastrados' };
        }

        return states;
    }
}
