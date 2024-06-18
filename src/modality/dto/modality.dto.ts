import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class ModalityDTO {
    @Transform(({ value }) => value.toUpperCase())
    @IsString({
        message: 'A descrição da modalidade deve ser passado nesse campo',
    })
    @IsDefined({ message: 'Modalidade é obrigatório' })
    descricao: string;
}

export class ModalityUpdateDTO extends PartialType(ModalityDTO) {
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({ message: 'O status do aluno deve ser passado nesse campo' })
    @IsOptional()
    status?: boolean;
}
