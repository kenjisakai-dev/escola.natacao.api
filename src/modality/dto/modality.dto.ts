import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsDefined, IsString } from 'class-validator';

export class ModalityDTO {
    @Transform(({ value }) => value.toUpperCase())
    @IsString({
        message: 'A descrição da modalidade deve ser passado nesse campo',
    })
    @IsDefined({ message: 'Modalidade é obrigatório' })
    descricao: string;
}

export class ModalityUpdateDTO extends PartialType(ModalityDTO) {}
