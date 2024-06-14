import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsDate, IsDefined, IsOptional } from 'class-validator';

export class FrequencyDTO {
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDate({
        message: 'A data de presença deve ser passado nesse campo',
    })
    @IsOptional()
    data_aula: Date;

    @Transform(({ value }) => (value === true ? 1 : 0))
    @IsDefined({ message: 'A presença é obrigatória' })
    presenca: number;

    @Transform(({ value }) => Number(value))
    @IsDefined({ message: 'Código da matricula é obrigatório' })
    cod_matricula: number;
}

export class FrequencyUpdateDTO extends PartialType(FrequencyDTO) {}
