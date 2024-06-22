import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDefined,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class StudentDTO {
    @ApiProperty({ example: 'Clara Isabel Mariane Cardoso' })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O nome deve ser passado nesse campo' })
    @IsDefined({ message: 'Nome é obrigatório' })
    nome: string;

    @ApiProperty({ example: '50391368893' })
    @Transform(({ value }) => value.toString())
    @Length(11, 11, {
        message: 'O CPF deve conter 11 números',
    })
    @IsDefined({ message: 'CPF é obrigatório' })
    cpf: string;

    @ApiProperty({ example: '11989457679' })
    @Transform(({ value }) => value.toString())
    @Length(10, 11, {
        message: 'O Telefone deve conter de 10 a 11 números incluindo o DDD',
    })
    @IsDefined({ message: 'Telefone é obrigatório' })
    telefone: string;

    @ApiProperty({ example: '06038360' })
    @Transform(({ value }) => value.toString())
    @Length(8, 8, {
        message: 'O CEP deve conter 8 números',
    })
    @IsDefined({ message: 'CEP é obrigatório' })
    cep: string;

    @ApiProperty({ example: 'SP' })
    @Transform(({ value }) => value.toUpperCase())
    @Length(2, 2, {
        message: 'O estado deve ser passado no formato UF',
    })
    @IsString({ message: 'O estado deve ser passado nesse campo' })
    @IsOptional()
    estado?: string;

    @ApiProperty({ example: 'Osasco' })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'A cidade deve ser passado nesse campo' })
    @IsOptional()
    cidade?: string;

    @ApiProperty({ example: "Jardim D'Abril" })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O bairro deve ser passado nesse campo' })
    @IsOptional()
    bairro?: string;

    @ApiProperty({ example: 'Rua Emílio Américo de Oliveira' })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'A rua deve ser passado nesse campo' })
    @IsOptional()
    rua?: string;

    @ApiProperty({ example: '211' })
    @Transform(({ value }) => value.toString().toUpperCase())
    @IsDefined({ message: 'Número é obrigatório' })
    numero: string;

    @ApiProperty({ example: null })
    @Transform(({ value }) => (value ? value.toUpperCase() : null))
    @IsString({ message: 'O complemento deve ser passado nesse campo' })
    @IsOptional()
    complemento?: string;
}

export class StudentUpdateDTO extends PartialType(StudentDTO) {
    @ApiProperty({ example: true })
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({ message: 'O status do aluno deve ser passado nesse campo' })
    @IsOptional()
    status?: boolean;
}
