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

    describe('State', () => {
        it('FindAll Empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/state/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                states: [],
                message: 'Não existe estados cadastrados',
            });
        });

        it('FindOne NotFound', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/state/findOne')
                .query({ estado: 'SP' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                state: null,
                message: 'Estado não encontrado',
            });
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/state/create')
                .send({ nome: 'sp' });

            expect(res.statusCode).toBe(201);
        });

        it('Create Existing', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/state/create')
                .send({ nome: 'sp' });

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('Estado já existente');
        });

        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/state/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual([
                {
                    cod_estado: 1,
                    nome: 'SP',
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/state/findOne')
                .query({ estado: 'SP' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_estado: 1,
                nome: 'SP',
            });
        });

        it('Create Invalid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/state/create')
                .send({ nome: 'São Paulo' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'A sigla do estado deve ter 2 caracteres',
            ]);
        });
    });

    describe('City', () => {});
});
