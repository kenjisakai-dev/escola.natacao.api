import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length } from 'class-validator';

export class StudentDTO {
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  nome: string;

  @IsString()
  cpf: string;

  @IsString()
  telefone: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  rua: string;

  @IsString()
  numero: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsOptional()
  @IsString()
  complemento?: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  bairro: string;

  @IsString()
  cep: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  cidade: string;

  @Transform(({ value }) => value.toUpperCase())
  @Length(2, 2, {
    message: 'O Nome do estado deve ter 2 caracteres',
  })
  @IsString()
  estado: string;
}
