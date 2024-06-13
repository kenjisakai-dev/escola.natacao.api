import { Transform } from 'class-transformer';
import { IsDefined, IsInt } from 'class-validator';

export class ModalityTeacherDTO {
    @Transform(({ value }) => Number(value))
    @IsInt({ message: 'O código do professor deve ser passado nesse campo' })
    @IsDefined({ message: 'Código do professor é obrigatório' })
    cod_professor: number;

    @Transform(({ value }) => Number(value))
    @IsInt({ message: 'O código da modalidade deve ser passado nesse campo' })
    @IsDefined({ message: 'Código da modalidade é obrigatório' })
    cod_modalidade: number;
}
