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

    describe('Modality', () => {
        it('FindAll empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/modality/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe modalidades cadastradas');
        });

        it('FindOne notFound', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/modality/findOne')
                .query({ descricao: 'Natação' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Modalidade não encontrada');
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/modality/create')
                .send({
                    descricao: 'Natação',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_modalidade: 1,
                descricao: 'NATAÇÃO',
            });
        });

        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/modality/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual([
                {
                    cod_modalidade: 1,
                    descricao: 'NATAÇÃO',
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/modality/findOne')
                .query({ descricao: 'Natação' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_modalidade: 1,
                descricao: 'NATAÇÃO',
            });
        });

        it('Update', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/modality/update')
                .query({ descricao: 'Natação' })
                .send({
                    descricao: 'Natação I',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_modalidade: 1,
                descricao: 'NATAÇÃO I',
            });
        });

        it('DTO', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/modality/create')
                .send();

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'Modalidade é obrigatório',
                'A descrição da modalidade deve ser passado nesse campo',
            ]);
        });
    });
});
