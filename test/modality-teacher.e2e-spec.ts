import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
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

    describe('Modality-Teacher', () => {
        it('Create Data', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/school/teacher/create')
                .send({
                    nome: 'Emanuelly Ester da Luz',
                    cpf: '16023002838',
                    telefone: '11986067733',
                    data_admissao: '2024-06-04',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/modality/create')
                .send({
                    descricao: 'Natação',
                });
        });

        it('FindAll empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/modality/teacher/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe(
                'Não existe professores cadastrados nas modalidades',
            );
        });

        it('FindOne notFound', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/modality/teacher/findOne')
                .query({ cod_modalidade_professor: 1 });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe(
                'Código da modalidade_professor não encontrado',
            );
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/modality/teacher/create')
                .send({
                    modalidade: 'Natação',
                    professor: 'Emanuelly Ester da Luz',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_modalidade_professor: 1,
                cod_modalidade: 1,
                cod_professor: 1,
            });
        });

        it('Create duplicate', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/modality/teacher/create')
                .send({
                    modalidade: 'Natação',
                    professor: 'Emanuelly Ester da Luz',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(
                'O professor já está vinculado na modalidade',
            );
        });

        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/modality/teacher/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual([
                {
                    cod_modalidade_professor: 1,
                    cod_modalidade: 1,
                    cod_professor: 1,
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/modality/teacher/findOne')
                .query({ cod_modalidade_professor: 1 });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_modalidade_professor: 1,
                cod_modalidade: 1,
                cod_professor: 1,
            });
        });

        it('DTO', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/modality/teacher/create')
                .send();

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'O nome do professor é obrigatório',
                'O nome do professor deve ser passado nesse campo',
                'A modalidade é obrigatório',
                'A modalidade deve ser passado nesse campo',
            ]);
        });
    });
});
