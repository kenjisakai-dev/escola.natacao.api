import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsDefined,
    IsInt,
    IsOptional,
} from 'class-validator';

export class RegistrationDTO {
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDate({
        message: 'A data de matricula deve ser passado nesse campo',
    })
    @IsOptional()
    data_matricula: Date;

    @Transform(({ value }) => Number(value))
    @IsDefined({ message: 'Código da modalidade_professor é obrigatório' })
    cod_turma: number;

    @Transform(({ value }) => Number(value))
    @IsInt({ message: 'O código do aluno deve ser passado nesse campo' })
    @IsDefined({ message: 'Código do aluno é obrigatório' })
    cod_aluno: number;
}

export class RegistrationUpdateDTO extends PartialType(RegistrationDTO) {
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({ message: 'O status do aluno deve ser passado nesse campo' })
    @IsOptional()
    status?: boolean;
}
