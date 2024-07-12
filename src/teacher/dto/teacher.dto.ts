import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsDefined,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';

export class TeacherDTO {
    @ApiProperty({ example: 'Fernanda Larissa Nunes' })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O nome deve ser passado nesse campo' })
    @IsDefined({ message: 'Nome é obrigatório' })
    nome: string;

    @ApiProperty({ example: '67783078893' })
    @Transform(({ value }) => value.toString())
    @Length(11, 11, {
        message: 'O CPF deve conter 11 números',
    })
    @IsDefined({ message: 'CPF é obrigatório' })
    cpf: string;

    @ApiProperty({ example: '11982940701' })
    @Transform(({ value }) => value.toString())
    @Length(10, 11, {
        message: 'O Telefone deve conter de 10 a 11 números incluindo o DDD',
    })
    @IsDefined({ message: 'Telefone é obrigatório' })
    telefone: string;

    @ApiProperty({ example: '2024-06-20' })
    @Transform(({ value }) => (value ? new Date(value) : new Date()))
    @IsDate({
        message: 'A data de admissão deve ser passado nesse campo',
    })
    @IsOptional()
    data_admissao?: Date;
}

export class TeacherUpdateDTO extends PartialType(TeacherDTO) {
    @ApiProperty({ example: true })
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({
        message: 'O status do professor deve ser passado nesse campo',
    })
    @IsOptional()
    status?: boolean;
}
