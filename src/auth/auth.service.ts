import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { compare } from 'bcrypt';
import { funcionario } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    createToken(data: funcionario) {
        const { cod_funcionario, nome, email, permissao } = data;

        return {
            acessToken: this.jwtService.sign(
                {
                    cod_funcionario,
                    nome,
                    email,
                    permissao,
                },
                {
                    expiresIn: '7 days',
                },
            ),
        };
    }

    checkToken(token: string) {
        return this.jwtService.verify(token);
    }

    async login(data: AuthLoginDTO) {
        const employee = await this.prismaService.funcionario.findUnique({
            where: {
                email: data.email,
            },
        });

        if (!employee) {
            throw new UnauthorizedException('Email inválido');
        }

        const comparePassword = await compare(data.senha, employee.senha);

        if (!comparePassword) {
            throw new UnauthorizedException('Senha incorreta');
        }

        return this.createToken(employee);
    }
}
