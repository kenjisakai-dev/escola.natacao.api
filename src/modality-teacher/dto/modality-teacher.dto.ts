import { IsDefined, IsString } from 'class-validator';

export class ModalityTeacherDTO {
    @IsString({ message: 'O nome do professor deve ser passado nesse campo' })
    @IsDefined({ message: 'O nome do professor é obrigatório' })
    professor: string;

    @IsString({ message: 'A modalidade deve ser passado nesse campo' })
    @IsDefined({ message: 'A modalidade é obrigatório' })
    modalidade: string;
}
