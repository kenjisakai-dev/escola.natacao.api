import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail } from 'class-validator';

export class AuthLoginDTO {
    @ApiProperty({ example: 'lorena_jesus@school.com.br' })
    @IsEmail({}, { message: 'O email deve ser passado nesse campo' })
    @IsDefined({ message: 'Email é obrigatório' })
    email: string;

    @ApiProperty({ example: 'lorena123' })
    @IsDefined({ message: 'Senha é obrigatório' })
    senha: string;
}
