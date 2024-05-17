import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StateDTO } from './state.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StateService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(state: StateDTO) {
    const find = await this.findOne(state.nome);

    if (find) {
      throw new BadRequestException('Estado já existente');
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
      throw new NotFoundException('O estado não foi encontrado');
    }

    return state;
  }

  async findAll() {
    const states = await this.prismaService.estado.findMany();

    if (!states) {
      throw new NotFoundException('Nenhum estado foi encontrado');
    }

    return states;
  }
}
