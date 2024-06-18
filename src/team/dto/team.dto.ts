import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class TeamDTO {
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O nome da turma deve ser passado nesse campo' })
    @IsDefined({ message: 'Nome da turma é obrigatório' })
    nome: string;

    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O horário da turma deve ser passado nesse campo' })
    @IsDefined({ message: 'Horário da turma é obrigatório' })
    horarios: string;

    @Transform(({ value }) => Number(value))
    @IsDefined({ message: 'Código da modalidade_professor é obrigatório' })
    cod_modalidade_professor: number;
}

export class TeamUpdateDTO extends PartialType(TeamDTO) {
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({
        message: 'O status do funcionário deve ser passado nesse campo',
    })
    @IsOptional()
    status?: boolean;
}
