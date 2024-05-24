import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { StudentDTO } from './student.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { StateService } from '../state/state.service';
import { CityService } from '../city/city.service';
import { StudentUpdateDTO } from './student-update.dto';

@Injectable()
export class StudentService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly stateService: StateService,
        private readonly cityService: CityService,
    ) {}

    async create(student: StudentDTO) {
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
        } = student;

        await this.checkExistingCPF(cpf);

        const _city = await this.cityService.getOrCreate({
            nome: cidade,
            estado: estado,
        });

        return await this.prismaService.aluno.create({
            data: {
                nome,
                cpf,
                telefone,
                cep,
                bairro,
                rua,
                numero,
                complemento,
                cod_cidade: _city.cod_cidade,
            },
        });
    }

    async update(name: string, student: StudentUpdateDTO) {
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
        } = student;

        const _student = await this.findOne(name);

        let data: any = {};

        if (cpf) {
            await this.checkExistingCPF(cpf);

            data.cpf = cpf;
        }

        if ((estado || cidade) && (!estado || !cidade)) {
            throw new BadRequestException(
                'A cidade e estado devem ser passados',
            );
        } else {
            const _estado = await this.stateService.getOrCreate(estado);
            const _cidade = await this.cityService.getOrCreate({
                nome: cidade,
                estado: _estado.nome,
            });

            data.cod_cidade = _cidade.cod_cidade;
        }

        if (nome) data.nome = nome;
        if (telefone) data.telefone = telefone;
        if (cep) data.cep = cep;
        if (bairro) data.bairro = bairro;
        if (rua) data.rua = rua;
        if (numero) data.numero = numero;
        if (complemento) data.complemento = complemento;

        return await this.prismaService.aluno.update({
            where: {
                cod_aluno: _student.cod_aluno,
            },
            data,
        });
    }

    async findOne(nome: string) {
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
