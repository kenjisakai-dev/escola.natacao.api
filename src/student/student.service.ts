import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { StudentDTO, StudentUpdateDTO } from './dto/student.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { getAddressByCEP } from '../helpers/address';
import { validateCPF } from '../helpers/cpf';
import { IAddress } from './interface/adress.interface';

@Injectable()
export class StudentService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: StudentDTO) {
        const {
            nome,
            cpf,
            telefone,
            cep,
            estado,
            cidade,
            bairro,
            rua,
            numero,
            complemento,
        } = data;

        await this.checkingCPF(cpf);

        const address = await this.checkingCEP({
            cep,
            estado,
            cidade,
            bairro,
            rua,
        });

        return await this.prismaService.aluno.create({
            data: {
                nome,
                cpf,
                telefone,
                cep,
                estado: address.estado,
                cidade: address.cidade,
                bairro: address.bairro,
                rua: address.rua,
                numero,
                complemento,
            },
        });
    }

    async update(cod_aluno: number, data: StudentUpdateDTO) {
        const {
            nome,
            cpf,
            telefone,
            cep,
            estado,
            cidade,
            bairro,
            rua,
            numero,
            complemento,
        } = data;

        if (cpf) {
            await this.checkingCPF(cpf);
        }

        let address: IAddress;

        if (cep || estado || cidade || bairro || rua || numero) {
            if (!cep || !numero) {
                throw new BadRequestException(
                    'O CEP e número residencial é obrigatório',
                );
            } else {
                address = await this.checkingCEP({
                    cep,
                    estado,
                    cidade,
                    bairro,
                    rua,
                });
            }
        }

        return await this.prismaService.aluno.update({
            where: {
                cod_aluno,
            },
            data: {
                nome,
                cpf,
                telefone,
                cep,
                estado: address.estado,
                cidade: address.cidade,
                bairro: address.bairro,
                rua: address.rua,
                numero,
                complemento,
            },
        });
    }

    async findOne(cod_aluno: number) {
        const student = await this.prismaService.aluno.findFirst({
            where: {
                cod_aluno,
            },
        });

        if (!student) {
            throw new NotFoundException('Aluno não encontrado');
        }

        return student;
    }

    async findAll() {
        const students = await this.prismaService.aluno.findMany();

        if (students.length === 0) {
            throw new NotFoundException('Não existe alunos cadastrados');
        }

        return students;
    }

    async checkingCPF(cpf: string) {
        const { valid } = await validateCPF(cpf);

        if (!valid) {
            throw new BadRequestException('CPF inválido');
        }

        const student = await this.prismaService.aluno.findFirst({
            where: {
                cpf,
            },
        });

        if (student) {
            throw new BadRequestException('CPF já cadastrado');
        }
    }

    async checkingCEP(data: IAddress) {
        const { cep, estado, cidade, bairro, rua } = data;

        const res = await getAddressByCEP(cep);

        let address: IAddress = {};

        if (!res?.erro) {
            address.estado = res.estado.toUpperCase();
            address.cidade = res.cidade.toUpperCase();
            address.bairro = res.bairro.toUpperCase();
            address.rua = res.rua.toUpperCase();
        } else if (!estado || !cidade || !bairro || !rua) {
            throw new BadRequestException(
                'CEP Inválido, será necessário passar o estado, cidade, bairro, rua e número junto com o CEP',
            );
        } else {
            address = data;
        }

        return address;
    }
}
