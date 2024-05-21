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
      return find;
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
      return null;
    }

    return state;
  }

  async findAll() {
    return await this.prismaService.estado.findMany();
  }
}
