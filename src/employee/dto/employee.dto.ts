import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDefined,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    IsStrongPassword,
} from 'class-validator';
import { Permission } from '../enum/permission.enum';

export class EmployeeDTO {
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O nome deve ser passado nesse campo' })
    @IsDefined({ message: 'Nome é obrigatório' })
    nome: string;

    @Transform(({ value }) => value.toLowerCase())
    @IsEmail({}, { message: 'O email deve ser passado nesse campo' })
    @IsDefined({ message: 'Email é obrigatório' })
    email: string;

    @IsStrongPassword(
        {
            minLength: 6,
            minLowercase: 0,
            minNumbers: 0,
            minSymbols: 0,
            minUppercase: 0,
        },
        { message: 'A senha deve ter no minimo 6 caracteres' },
    )
    @IsDefined({ message: 'Senha é obrigatório' })
    senha: string;

    @IsEnum(Permission, {
        message: 'A permissão deve ser passado nesse campo',
    })
    @IsOptional()
    permissao?: number;
}

export class EmployeeUpdateDTO extends PartialType(EmployeeDTO) {
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({
        message: 'O status do funcionário deve ser passado nesse campo',
    })
    @IsOptional()
    status?: boolean;
}
