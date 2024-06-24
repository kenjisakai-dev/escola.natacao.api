import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('TeamController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
            }),
        );
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeAll(async () => {
        prismaService = new PrismaService();

        await prismaService.funcionario.create({
            data: {
                nome: 'LORENA STEFANY FÁTIMA JESUS',
                email: 'lorena_jesus@school.com.br',
                senha: '$2b$10$cmFbzueEBcfu3/UN6v7Wz.gQdC4Tq.ICHCF2wJ93DgH36P749uT2m',
                permissao: 1,
            },
        });

        const login = await request(app.getHttpServer())
            .post('/api/v1/school/auth/login')
            .send({
                email: 'lorena_jesus@school.com.br',
                senha: 'lorena123',
            });

        token = login.body.acessToken;
    });

    beforeAll(async () => {
        await request(app.getHttpServer())
            .post('/api/v1/school/teacher/create')
            .set('Authorization', token)
            .send({
                nome: 'Sabrina Rita Farias',
                cpf: '71889751839',
                telefone: '11983522207',
                data_admissao: '2024-05-15',
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/modality/create')
            .set('Authorization', token)
            .send({
                descricao: 'Natação',
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/modality/create')
            .set('Authorization', token)
            .send({
                descricao: 'Hidroginástica',
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send({
                cod_modalidade: 1,
                cod_professor: 1,
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send({
                cod_modalidade: 2,
                cod_professor: 1,
            });
    });

    it('FindAll empty', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/team/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Não existe turmas cadastradas');
    });

    it('FindOne notFound', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/team/findOne')
            .set('Authorization', token)
            .query({ cod_turma: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Turma não encontrada');
    });

    it('Create', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/team/create')
            .set('Authorization', token)
            .send({
                nome: 'Natação A2',
                horarios: 'seg/qua - 09:00 às 10:00',
                cod_modalidade_professor: 1,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toStrictEqual({
            cod_turma: 1,
            nome: 'NATAÇÃO A2',
            horarios: 'SEG/QUA - 09:00 ÀS 10:00',
            cod_modalidade_professor: 1,
            status: true,
        });
    });

    it('Create - Cod-modality-teacher notFound', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/team/create')
            .set('Authorization', token)
            .send({
                nome: 'AAA',
                horarios: '00:00',
                cod_modalidade_professor: 1000,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(
            'Registro do professor na Modalidade não encontrado',
        );
    });

    it('FindAll', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/team/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([
            {
                cod_turma: 1,
                nome: 'NATAÇÃO A2',
                horarios: 'SEG/QUA - 09:00 ÀS 10:00',
                cod_modalidade_professor: 1,
                status: true,
            },
        ]);
    });

    it('FindOne', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/team/findOne')
            .set('Authorization', token)
            .query({ cod_turma: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_turma: 1,
            nome: 'NATAÇÃO A2',
            horarios: 'SEG/QUA - 09:00 ÀS 10:00',
            cod_modalidade_professor: 1,
            status: true,
        });
    });

    it('Update', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/team/update')
            .set('Authorization', token)
            .query({ cod_turma: 1 })
            .send({
                cod_modalidade_professor: 2,
                status: false,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_turma: 1,
            nome: 'NATAÇÃO A2',
            horarios: 'SEG/QUA - 09:00 ÀS 10:00',
            cod_modalidade_professor: 2,
            status: false,
        });
    });

    it('Update - Cod-modality-teacher notFound', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/team/create')
            .set('Authorization', token)
            .query({ cod_turma: 1 })
            .send({
                nome: 'AAA',
                horarios: '00:00',
                cod_modalidade_professor: 1000,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(
            'Registro do professor na Modalidade não encontrado',
        );
    });

    it('DTO', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/team/create')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual([
            'Nome da turma é obrigatório',
            'O nome da turma deve ser passado nesse campo',
            'Horário da turma é obrigatório',
            'O horário da turma deve ser passado nesse campo',
            'Código da modalidade_professor é obrigatório',
        ]);
    });
});
