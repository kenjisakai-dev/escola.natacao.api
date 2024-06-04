import { Transform } from 'class-transformer';
import { IsDate, IsDefined, IsString, Length } from 'class-validator';
import { formatDate } from '../../helpers/date';

export class TeacherDTO {
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O nome deve ser passado nesse campo' })
    @IsDefined({ message: 'Nome é obrigatório' })
    nome: string;

    @Transform(({ value }) => value.toString())
    @Length(11, 11, {
        message: 'O CPF deve conter 11 números',
    })
    @IsDefined({ message: 'CPF é obrigatório' })
    cpf: string;

    @Transform(({ value }) => value.toString())
    @Length(10, 11, {
        message: 'O Telefone deve conter de 10 a 11 números incluindo o DDD',
    })
    @IsDefined({ message: 'Telefone é obrigatório' })
    telefone: string;

    @Transform(({ value }) => formatDate(value))
    @IsDate({
        message: 'A data de admissão deve ser passado nesse campo',
    })
    @IsDefined({ message: 'Data de admissão é obrigatório' })
    data_admissao: Date;
}
