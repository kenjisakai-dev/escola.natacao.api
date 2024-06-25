import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('ModalityTeacherController (e2e)', () => {
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
                nome: 'Emanuelly Ester da Luz',
                cpf: '16023002838',
                telefone: '11986067733',
                data_admissao: '2024-06-04',
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
    });

    it('FindAll empty', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/modality/teacher/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(
            'Não existe professores cadastrados nas modalidades',
        );
    });

    it('FindOne notFound', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/modality/teacher/findOne')
            .set('Authorization', token)
            .query({ cod_modalidade_professor: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(
            'Registro do professor na Modalidade não encontrado',
        );
    });

    it('Create', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send({
                cod_modalidade: 1,
                cod_professor: 1,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toStrictEqual({
            cod_modalidade_professor: 1,
            cod_modalidade: 1,
            cod_professor: 1,
            status: true,
        });
    });

    it('Create - Modality notFound', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send({
                cod_modalidade: 1000,
                cod_professor: 1,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Modalidade não encontrada');
    });

    it('Create - Teacher notFound', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send({
                cod_modalidade: 1,
                cod_professor: 1000,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Professor não encontrado');
    });

    it('Create - Register existing', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send({
                cod_modalidade: 1,
                cod_professor: 1,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(
            'O professor já está vinculado na modalidade',
        );
    });

    it('FindAll', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/modality/teacher/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([
            {
                cod_modalidade_professor: 1,
                cod_modalidade: 1,
                cod_professor: 1,
                status: true,
            },
        ]);
    });

    it('FindOne', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/modality/teacher/findOne')
            .set('Authorization', token)
            .query({ cod_modalidade_professor: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_modalidade_professor: 1,
            cod_modalidade: 1,
            cod_professor: 1,
            status: true,
        });
    });

    it('Update', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/modality/teacher/update')
            .set('Authorization', token)
            .query({ cod_modalidade_professor: 1 })
            .send({
                cod_modalidade: 2,
                cod_professor: 1,
                status: false,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_modalidade_professor: 1,
            cod_modalidade: 2,
            cod_professor: 1,
            status: false,
        });
    });

    it('Update - non-existent mod_tea', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/modality/teacher/update')
            .set('Authorization', token)
            .query({ cod_modalidade_professor: 1000 })
            .send({
                cod_modalidade: 2,
                cod_professor: 1,
                status: false,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe(
            'Registro do professor na Modalidade não encontrado',
        );
    });

    it('Update - Modality notFound', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/modality/teacher/update')
            .set('Authorization', token)
            .query({ cod_modalidade_professor: 1 })
            .send({
                cod_modalidade: 1000,
                cod_professor: 1,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Modalidade não encontrada');
    });

    it('Update - Teacher notFound', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/modality/teacher/update')
            .set('Authorization', token)
            .query({ cod_modalidade_professor: 1 })
            .send({
                cod_modalidade: 1,
                cod_professor: 1000,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Professor não encontrado');
    });

    it('Update - Register existing', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/modality/teacher/update')
            .set('Authorization', token)
            .query({ cod_modalidade_professor: 1 })
            .send({
                cod_modalidade: 2,
                cod_professor: 1,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(
            'Vinculo entre professor e modalidade já existente',
        );
    });

    it('DTO', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual([
            'Código do professor é obrigatório',
            'O código do professor deve ser passado nesse campo',
            'Código da modalidade é obrigatório',
            'O código da modalidade deve ser passado nesse campo',
        ]);
    });
});
