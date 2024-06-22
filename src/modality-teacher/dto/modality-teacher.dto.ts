import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsInt, IsOptional } from 'class-validator';

export class ModalityTeacherDTO {
    @ApiProperty({ example: 1 })
    @Transform(({ value }) => Number(value))
    @IsInt({ message: 'O código do professor deve ser passado nesse campo' })
    @IsDefined({ message: 'Código do professor é obrigatório' })
    cod_professor: number;

    @ApiProperty({ example: 1 })
    @Transform(({ value }) => Number(value))
    @IsInt({ message: 'O código da modalidade deve ser passado nesse campo' })
    @IsDefined({ message: 'Código da modalidade é obrigatório' })
    cod_modalidade: number;
}

export class ModalityTeacherUpdateDTO extends ModalityTeacherDTO {
    @ApiProperty({ example: true })
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({
        message: 'O status do professor deve ser passado nesse campo',
    })
    @IsOptional()
    status?: boolean;
}
