import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { EmployeeDTO, EmployeeUpdateDTO } from './dto/employee.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { hash } from 'bcrypt';

@Injectable()
export class EmployeeService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly authService: AuthService,
    ) {}

    async create(data: EmployeeDTO) {
        const email = await this.prismaService.funcionario.findFirst({
            where: {
                email: data.email,
            },
        });

        if (email) {
            throw new BadRequestException('Email já cadastrado');
        }

        data.senha = await hash(data.senha, 10);

        const employee = await this.prismaService.funcionario.create({
            data,
        });

        return this.authService.createToken(employee);
    }

    async update(cod_funcionario: number, data: EmployeeUpdateDTO) {
        await this.findOne(cod_funcionario);

        if (data.email) {
            const email = await this.prismaService.funcionario.findFirst({
                where: {
                    email: data.email,
                },
            });

            if (email) {
                throw new BadRequestException('Email já cadastrado');
            }
        }

        if (data.senha) {
            data.senha = await hash(data.senha, 10);
        }

        return await this.prismaService.funcionario.update({
            where: {
                cod_funcionario,
            },
            data,
        });
    }

    async findOne(cod_funcionario: number) {
        const employee = await this.prismaService.funcionario.findFirst({
            where: {
                cod_funcionario,
            },
        });

        if (!employee) {
            throw new NotFoundException('Funcionário não encontrado');
        }

        return employee;
    }

    async findAll() {
        const employees = await this.prismaService.funcionario.findMany();

        if (employees.length === 0) {
            throw new NotFoundException('Não existe funcionários cadastrados');
        }

        return employees;
    }
}
