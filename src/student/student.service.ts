import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { StudentDTO, StudentUpdateDTO } from './dto/student.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { getAddressByCEP } from '../helpers/address';
import { validateCPF } from '../helpers/cpf';

@Injectable()
export class StudentService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(data: StudentDTO) {
        let { cpf, cep, estado, cidade, bairro, rua } = data;

        await this.checkingCPF(cpf);

        const addres = await getAddressByCEP(cep);

        if (!addres?.erro) {
            estado = addres?.uf.toUpperCase();
            cidade = addres?.localidade.toUpperCase();
            bairro = addres?.bairro.toUpperCase();
            rua = addres?.logradouro.toUpperCase();
        } else if (!estado || !cidade || !bairro || !rua) {
            throw new BadRequestException(
                'CEP Inválido, será necessário passar o estado, cidade, bairro e rua junto com o CEP',
            );
        }

        return await this.prismaService.aluno.create({
            data: {
                ...data,
                estado,
                cidade,
                bairro,
                rua,
            },
        });
    }

    async update(nome: string, data: StudentUpdateDTO) {
        const { cpf, cep, estado, cidade, bairro, rua, numero } = data;

        if (cpf) {
            await this.checkingCPF(cpf);
        }

        if (cep || estado || cidade || bairro || rua || numero) {
            if (!cep || !numero) {
                throw new BadRequestException(
                    'O CEP e número residencial é obrigatório',
                );
            } else {
                const addres = await getAddressByCEP(cep);

                if (!addres?.erro) {
                    data.estado = addres?.uf.toUpperCase();
                    data.cidade = addres?.localidade.toUpperCase();
                    data.bairro = addres?.bairro.toUpperCase();
                    data.rua = addres?.logradouro.toUpperCase();
                } else if (!estado || !cidade || !bairro || !rua) {
                    throw new BadRequestException(
                        'CEP Inválido, será necessário passar o estado, cidade, bairro, rua e número junto com o CEP',
                    );
                }
            }
        }

        const { cod_aluno } = await this.findOne(nome);

        return await this.prismaService.aluno.update({
            where: {
                cod_aluno,
            },
            data,
        });
    }

    async findOne(nome: string = '') {
        const student = await this.prismaService.aluno.findFirst({
            where: {
                nome,
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
}
