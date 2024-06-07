import { Transform } from 'class-transformer';
import { IsDate, IsDefined, IsOptional, IsString } from 'class-validator';

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

    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O nome do aluno deve ser passado nesse campo' })
    @IsDefined({ message: 'Nome do aluno é obrigatório' })
    aluno: string;
}
