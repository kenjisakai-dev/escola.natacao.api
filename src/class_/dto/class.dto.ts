import { Transform } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class ClassDTO {
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
