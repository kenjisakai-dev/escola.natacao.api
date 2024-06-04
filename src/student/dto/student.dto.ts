import { Transform } from 'class-transformer';
import { IsDefined, IsOptional, IsString, Length } from 'class-validator';

export class StudentDTO {
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

    @Transform(({ value }) => value.toString())
    @Length(8, 8, {
        message: 'O CEP deve conter 8 números',
    })
    @IsDefined({ message: 'CEP é obrigatório' })
    cep: string;

    @Transform(({ value }) => value.toUpperCase())
    @Length(2, 2, {
        message: 'O estado deve ser passado no formato UF',
    })
    @IsString({ message: 'O estado deve ser passado nesse campo' })
    @IsOptional()
    estado?: string;

    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'A cidade deve ser passado nesse campo' })
    @IsOptional()
    cidade?: string;

    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O bairro deve ser passado nesse campo' })
    @IsOptional()
    bairro?: string;

    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'A rua deve ser passado nesse campo' })
    @IsOptional()
    rua?: string;

    @Transform(({ value }) => value.toString().toUpperCase())
    @IsDefined({ message: 'Número é obrigatório' })
    numero: string;

    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O complemento deve ser passado nesse campo' })
    @IsOptional()
    complemento?: string;
}
