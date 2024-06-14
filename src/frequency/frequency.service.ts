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

    async create(data: FrequencyDTO) {
        const { cod_matricula } = data;

        await this.registrationService.findOne(cod_matricula);

        return await this.prismaService.frequencia.create({
            data,
        });
    }

    async update(cod_frequencia: number, data: FrequencyUpdateDTO) {
        const { cod_matricula } = data;

        await this.findOne(cod_frequencia);

        if (cod_matricula) {
            await this.registrationService.findOne(cod_matricula);
        }

        return await this.prismaService.frequencia.update({
            where: {
                cod_frequencia,
            },
            data,
        });
    }

    async findOne(cod_frequencia: number) {
        const frequency = await this.prismaService.frequencia.findUnique({
            where: {
                cod_frequencia,
            },
        });

        if (!frequency) {
            throw new NotFoundException(
                'Registro da frequencia não encontrado',
            );
        }

        return frequency;
    }

    async findAll() {
        const frequencies = await this.prismaService.frequencia.findMany();

        if (frequencies.length === 0) {
            throw new NotFoundException(
                'Não existe registros de frequencias cadastrados',
            );
        }

        return frequencies;
    }
}
