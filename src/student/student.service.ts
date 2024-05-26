import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { StudentDTO } from './student.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { StudentUpdateDTO } from './student-update.dto';
import { getAddressByCEP } from '../helpers/address';

@Injectable()
export class StudentService {
    constructor(private readonly prismaService: PrismaService) {}

    async create(student: StudentDTO) {
        try {
            let {
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
            } = student;

            const addres = await getAddressByCEP(cep);

            if (!addres?.erro) {
                estado = addres?.uf.toUpperCase();
                cidade = addres?.localidade.toUpperCase();
                bairro = addres?.bairro.toUpperCase();
                rua = addres?.logradouro.toUpperCase();
            } else if (!estado || !cidade || !bairro || !rua) {
                throw new BadRequestException(
                    'CEP Inválido, será necessário passar o CEP, estado, cidade, bairro e rua',
                );
            }

            await this.checkExistingCPF(cpf);

            return await this.prismaService.aluno.create({
                data: {
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
                },
            });
        } catch (err) {
            throw new BadRequestException(err?.response);
        }
    }

    async update(name: string, student: StudentUpdateDTO) {
        let { cpf, cep, estado, cidade, bairro, rua, numero } = student;

        if (cpf) {
            await this.checkExistingCPF(cpf);
            student.cpf = cpf;
        }

        if (cep || estado || cidade || bairro || rua || numero) {
            if (!cep || !numero) {
                throw new BadRequestException('CEP e número é obrigatório');
            } else {
                const addres = await getAddressByCEP(cep);

                if (!addres?.erro) {
                    student.estado = addres?.uf.toUpperCase();
                    student.cidade = addres?.localidade.toUpperCase();
                    student.bairro = addres?.bairro.toUpperCase();
                    student.rua = addres?.logradouro.toUpperCase();
                } else if (!estado || !cidade || !bairro || !rua) {
                    throw new BadRequestException(
                        'CEP Inválido, será necessário passar o CEP, estado, cidade, bairro, rua e número',
                    );
                }
            }
        }

        const { cod_aluno } = await this.findOne(name ?? '');

        return await this.prismaService.aluno.update({
            where: {
                cod_aluno,
            },
            data: student,
        });
    }

    async findOne(nome: string) {
        const student = await this.prismaService.aluno.findFirst({
            where: {
                nome: nome ?? '',
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

    async checkExistingCPF(cpf: string) {
        const data = await this.prismaService.aluno.findFirst({
            where: {
                cpf,
            },
        });

        if (data) {
            throw new BadRequestException('CPF já cadastrado');
        }
    }
}
