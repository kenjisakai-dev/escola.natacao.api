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
    const cpf = await this.prismaService.aluno.findFirst({
      where: {
        cpf: student.cpf,
      },
    });

    if (cpf) {
      throw new BadRequestException('CPF já cadastrado');
    }

    let cidade = await this.prismaService.cidade.findFirst({
      where: {
        nome: student.cidade,
      },
    });

    if (!cidade) {
      const estado = await this.prismaService.estado.findFirst({
        where: {
          nome: student.estado,
        },
      });

      if (!estado) {
        const createEstado = await this.stateService.create({
          nome: student.estado,
        });
        cidade = await this.cityService.create({
          nome: student.cidade,
          estado: createEstado.nome,
        });
      } else {
        cidade = await this.cityService.create({
          nome: student.cidade,
          estado: student.estado,
        });
      }
    }

    const { nome, telefone, cep, bairro, rua, numero } = student;

    return await this.prismaService.aluno.create({
      data: {
        nome,
        cpf: student.cpf,
        telefone,
        cep,
        bairro,
        rua,
        numero,
        cod_cidade: cidade.cod_cidade,
      },
    });
  }

  async update(nameParam: string, student: StudentUpdateDTO) {
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

    const findStudent = await this.findOne(nameParam);

    let studentUpdate: any = {};
    if (nome) studentUpdate.nome = nome;
    if (cpf) {
      const findCPF = await this.prismaService.aluno.findFirst({
        where: {
          cpf,
          NOT: {
            nome: nameParam,
          },
        },
      });

      if (findCPF) {
        throw new BadRequestException('CPF já cadastrado');
      }

      studentUpdate.cpf = cpf;
    }
    if (telefone) studentUpdate.telefone = telefone;
    if (cep) studentUpdate.cep = cep;
    if (estado || cidade) {
      if (!estado || !cidade) {
        throw new BadRequestException(
          'O estado deve ser passado junto com a cidade',
        );
      }

      let findEstado = await this.prismaService.estado.findFirst({
        where: {
          nome: estado,
        },
      });

      if (!findEstado) {
        findEstado = await this.stateService.create({
          nome: estado,
        });
      }

      let findCidade = await this.prismaService.cidade.findFirst({
        where: {
          nome: cidade,
        },
      });
      if (!findCidade) {
        findCidade = await this.cityService.create({
          nome: cidade,
          estado: findEstado.nome,
        });
      }

      studentUpdate.cod_cidade = findCidade.cod_cidade;
    }

    if (bairro) studentUpdate.bairro = bairro;
    if (rua) studentUpdate.rua = rua;
    if (numero) studentUpdate.numero = numero;
    if (complemento) studentUpdate.complemento = complemento;

    return await this.prismaService.aluno.update({
      where: {
        cod_aluno: findStudent.cod_aluno,
      },
      data: studentUpdate,
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
    const student = await this.prismaService.aluno.findMany();

    if (student.length === 0) {
      throw new NotFoundException('Não existe alunos cadastrados');
    }

    return student;
  }
}
