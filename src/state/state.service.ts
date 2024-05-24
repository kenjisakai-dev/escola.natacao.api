import { Injectable, NotFoundException } from '@nestjs/common';
import { StateDTO } from './state.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StateService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(state: StateDTO) {
        return await this.prismaService.estado.create({ data: state });
    }

    async findOne(estado: string) {
        const state = await this.prismaService.estado.findFirst({
            where: {
                nome: estado,
            },
        });

        if (!state) {
            throw new NotFoundException('Estado não encontrado');
        }

        return state;
    }

    async findAll() {
        const states = await this.prismaService.estado.findMany();

        if (states.length === 0) {
            throw new NotFoundException('Não existe estados cadastrados');
        }

        return states;
    }

    async getOrCreate(estado: string) {
        const state = await this.findOne(estado);

        if (!state) {
            return await this.create({ nome: estado });
        }

        return state;
    }
}
