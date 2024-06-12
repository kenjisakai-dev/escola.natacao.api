import { IsDefined, IsEmail } from 'class-validator';

export class AuthLoginDTO {
    @IsEmail({}, { message: 'O email deve ser passado nesse campo' })
    @IsDefined({ message: 'Email é obrigatório' })
    email: string;

    @IsDefined({ message: 'Senha é obrigatório' })
    senha: string;
}
