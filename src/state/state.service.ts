import { Injectable } from '@nestjs/common';
import { StateDTO } from './state.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StateService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(state: StateDTO) {
    const states = await this.findAll();
    const find = states.find((x) => x.nome === state.nome);

    if (find) {
      return {
        message: 'Estado informado já existe e possuí os seguintes dados',
        data: {
          cod_estado: find.cod_estado,
          nome: find.nome,
        },
      };
    }

    return await this.prismaService.estado.create({ data: state });
  }

  async findAll() {
    return await this.prismaService.estado.findMany();
  }
}
