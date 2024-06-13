import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsString } from 'class-validator';

export class ModalityTeacherDTO {
    @Transform(({ value }) => Number(value))
    @IsInt({ message: 'O código do professor deve ser passado nesse campo' })
    @IsDefined({ message: 'Código do professor é obrigatório' })
    cod_professor: number;

    @IsString({ message: 'A modalidade deve ser passado nesse campo' })
    @IsDefined({ message: 'A modalidade é obrigatório' })
    modalidade: string;
}
