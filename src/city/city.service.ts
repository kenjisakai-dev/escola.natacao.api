import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CityDTO } from './city.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { StateService } from '../state/state.service';

@Injectable()
export class CityService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly stateService: StateService,
  ) {}

  async create(city: CityDTO) {
    let state = await this.prismaService.estado.findFirst({
      where: {
        nome: city.estado,
      },
    });

    if (!state) {
      state = await this.stateService.create({ nome: city.estado });
    }

    const findCity = await this.prismaService.cidade.findFirst({
      where: {
        nome: city.nome,
        cod_estado: state.cod_estado,
      },
    });

    if (findCity) {
      throw new BadRequestException('Já existe uma cidade atrelada ao estado');
    }

    return await this.prismaService.cidade.create({
      data: {
        nome: city.nome,
        cod_estado: state.cod_estado,
      },
    });
  }

  async findOne(cidade: string) {
    const state = await this.prismaService.cidade.findMany({
      where: {
        nome: cidade,
      },
    });

    if (state.length === 0) {
      throw new NotFoundException('A cidade não foi encontrada');
    }

    return state;
  }

  async findAll() {
    const cities = await this.prismaService.cidade.findMany();

    if (!cities) {
      throw new NotFoundException('Nenhuma cidade foi encontrada');
    }

    return cities;
  }
}
