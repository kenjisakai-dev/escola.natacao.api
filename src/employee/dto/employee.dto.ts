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
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class EmployeeDTO {
    @ApiProperty({ example: 'Lúcia Andreia Emilly Viana' })
    @Transform(({ value }) => value.toUpperCase())
    @IsString({ message: 'O nome deve ser passado nesse campo' })
    @IsDefined({ message: 'Nome é obrigatório' })
    nome: string;

    @ApiProperty({ example: 'lucia.andreia@school.com.br' })
    @Transform(({ value }) => value.toLowerCase())
    @IsEmail({}, { message: 'O email deve ser passado nesse campo' })
    @IsDefined({ message: 'Email é obrigatório' })
    email: string;

    @ApiProperty({ example: 'lucia123' })
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

    @ApiProperty({ example: 2 })
    @IsEnum(Permission, {
        message: 'A permissão deve ser passado nesse campo',
    })
    @IsOptional()
    permissao?: number;
}

export class EmployeeUpdateDTO extends PartialType(EmployeeDTO) {
    @ApiProperty({ example: true })
    @Transform(({ value }) => Boolean(value))
    @IsBoolean({
        message: 'O status do funcionário deve ser passado nesse campo',
    })
    @IsOptional()
    status?: boolean;
}
