import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class CityDTO {
    @Transform(({ value }) => value.toUpperCase())
    @IsString()
    nome: string;

    @Transform(({ value }) => value.toUpperCase())
    @Length(2, 2, {
        message: 'A sigla do estado deve ter 2 caracteres',
    })
    @IsString()
    estado: string;
}
