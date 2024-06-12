import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { FrequencyDTO, FrequencyUpdateDTO } from './dto/frequency.dto';
import { RegistrationService } from '../matricula/registration.service';

@Injectable()
export class FrequencyService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly registrationService: RegistrationService,
    ) {}

    async create(frequency: FrequencyDTO) {
        const { data, presenca, cod_matricula } = frequency;

        await this.registrationService.findOne(cod_matricula);

        return await this.prismaService.frequencia.create({
            data: {
                data: data ?? new Date(),
                presenca,
                cod_matricula,
            },
        });
    }

    async update(cod_frequencia: number, frequency: FrequencyUpdateDTO) {
        const { data, presenca, cod_matricula } = frequency;

        await this.findOne(cod_frequencia);

        if (cod_matricula) {
            await this.registrationService.findOne(cod_matricula);
        }

        return await this.prismaService.frequencia.update({
            where: {
                cod_frequencia,
            },
            data: {
                data,
                presenca,
                cod_matricula,
            },
        });
    }

    async findOne(cod_frequencia: number) {
        const result = await this.prismaService.frequencia.findUnique({
            where: {
                cod_frequencia,
            },
        });

        if (!result) {
            throw new NotFoundException(
                'Registro da frequencia não encontrado',
            );
        }

        return result;
    }

    async findAll() {
        const result = await this.prismaService.frequencia.findMany();

        if (result.length === 0) {
            throw new NotFoundException(
                'Não existe registros de frequencias cadastrados',
            );
        }

        return result;
    }
}
