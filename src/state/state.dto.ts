import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class StateDTO {
  @Transform(({ value }) => value.toUpperCase())
  @Length(2, 2, {
    message: 'O Nome do estado deve ter 2 caracteres',
  })
  @IsString()
  nome: string;
}
