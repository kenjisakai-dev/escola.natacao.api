import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class CityDTO {
  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  nome: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsString()
  estado: string;
}
