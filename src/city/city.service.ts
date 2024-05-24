import { Injectable, NotFoundException } from '@nestjs/common';
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
        const { nome, estado } = city;

        const _state = await this.stateService.getOrCreate(estado);

        return await this.prismaService.cidade.create({
            data: {
                nome,
                cod_estado: _state.cod_estado,
            },
        });
    }

    async findOne(cidade: string) {
        const city = await this.prismaService.cidade.findFirst({
            where: {
                nome: cidade,
            },
        });

        if (!city) {
            throw new NotFoundException('Cidade não encontrada');
        }

        return city;
    }

    async findAll() {
        const cities = await this.prismaService.cidade.findMany();

        if (cities.length === 0) {
            throw new NotFoundException('Não existe cidades cadastradas');
        }

        return cities;
    }

    async getOrCreate(city: CityDTO) {
        const { nome, estado } = city;

        const _city = await this.prismaService.cidade.findFirst({
            where: {
                nome,
            },
        });

        if (!_city) {
            return await this.create({ nome, estado });
        }

        return _city;
    }
}
