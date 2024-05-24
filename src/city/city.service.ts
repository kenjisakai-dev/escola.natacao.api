import { Injectable } from '@nestjs/common';
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
        const state = await this.stateService.create({ nome: city.estado });

        const findCity = await this.prismaService.cidade.findFirst({
            where: {
                nome: city.nome,
                cod_estado: state.cod_estado,
            },
        });

        if (findCity) {
            return { ...findCity, message: 'Cidade já existente' };
        }

        return await this.prismaService.cidade.create({
            data: {
                nome: city.nome,
                cod_estado: state.cod_estado,
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
            return { city: [], message: 'Cidade não encontrada' };
        }

        return city;
    }

    async findAll() {
        const cities = await this.prismaService.cidade.findMany();

        if (cities.length === 0) {
            return { cities: [], message: 'Não existe cidades cadastradas' };
        }

        return { cities };
    }
}
