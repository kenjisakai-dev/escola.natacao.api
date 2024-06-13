import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsDate, IsDefined, IsInt, IsOptional } from 'class-validator';

export class RegistrationDTO {
    @Transform(({ value }) => new Date(value))
    @IsDate({
        message: 'A data de matricula deve ser passado nesse campo',
    })
    @IsOptional()
    data?: Date;

    @Transform(({ value }) => Number(value))
    @IsDefined({ message: 'Código da modalidade_professor é obrigatório' })
    cod_turma: number;

    @Transform(({ value }) => Number(value))
    @IsInt({ message: 'O código do aluno deve ser passado nesse campo' })
    @IsDefined({ message: 'Código do aluno é obrigatório' })
    cod_aluno: number;
}

export class RegistrationUpdateDTO extends PartialType(RegistrationDTO) {}
