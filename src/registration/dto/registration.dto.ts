import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsDefined,
    IsInt,
    IsOptional,
} from 'class-validator';

export class RegistrationDTO {
    @ApiProperty({ example: '2024-06-21' })
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDate({
        message: 'A data de matricula deve ser passado nesse campo',
    })
    @IsOptional()
    data_matricula: Date;

    @ApiProperty({ example: 1 })
    @Transform(({ value }) => Number(value))
    @IsDefined({ message: 'Código da modalidade_professor é obrigatório' })
    cod_turma: number;

    @ApiProperty({ example: 1 })
    @Transform(({ value }) => Number(value))
    @IsInt({ message: 'O código do aluno deve ser passado nesse campo' })
    @IsDefined({ message: 'Código do aluno é obrigatório' })
    cod_aluno: number;
}

export class RegistrationUpdateDTO extends PartialType(RegistrationDTO) {
    @ApiProperty({ example: null })
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({ message: 'O status do aluno deve ser passado nesse campo' })
    @IsOptional()
    status?: boolean;
}
