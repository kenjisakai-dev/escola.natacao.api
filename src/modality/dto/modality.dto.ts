import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class ModalityDTO {
    @ApiProperty({ example: 'Natação' })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({
        message: 'A descrição da modalidade deve ser passado nesse campo',
    })
    @IsDefined({ message: 'Modalidade é obrigatório' })
    descricao: string;
}

export class ModalityUpdateDTO extends PartialType(ModalityDTO) {
    @ApiProperty({ example: true })
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({ message: 'O status do aluno deve ser passado nesse campo' })
    @IsOptional()
    status?: boolean;
}
