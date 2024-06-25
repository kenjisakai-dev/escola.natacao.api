import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsDefined, IsOptional } from 'class-validator';

export class FrequencyDTO {
    @ApiProperty({ example: '2024-06-30' })
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDate({
        message: 'A data de presença deve ser passado nesse campo',
    })
    @IsOptional()
    data_aula: Date;

    @ApiProperty({ example: true })
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({ message: 'A presença deve ser passada nesse campo' })
    @IsDefined({ message: 'A presença é obrigatória' })
    presenca: boolean;

    @ApiProperty({ example: 1 })
    @Transform(({ value }) => Number(value))
    @IsDefined({ message: 'Código da matricula é obrigatório' })
    cod_matricula: number;
}

export class FrequencyUpdateDTO extends PartialType(FrequencyDTO) {}
