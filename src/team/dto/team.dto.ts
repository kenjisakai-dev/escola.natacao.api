import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class TeamDTO {
    @ApiProperty({ example: 'Natação A1' })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O nome da turma deve ser passado nesse campo' })
    @IsDefined({ message: 'Nome da turma é obrigatório' })
    nome: string;

    @ApiProperty({ example: 'TER/QUI das 09:00 às 10:00' })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O horário da turma deve ser passado nesse campo' })
    @IsDefined({ message: 'Horário da turma é obrigatório' })
    horarios: string;

    @ApiProperty({ example: 1 })
    @Transform(({ value }) => Number(value))
    @IsDefined({ message: 'Código da modalidade_professor é obrigatório' })
    cod_modalidade_professor: number;
}

export class TeamUpdateDTO extends PartialType(TeamDTO) {
    @ApiProperty({ example: true })
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({
        message: 'O status do funcionário deve ser passado nesse campo',
    })
    @IsOptional()
    status?: boolean;
}
