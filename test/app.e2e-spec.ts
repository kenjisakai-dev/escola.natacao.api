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

    beforeEach(async () => {
        await app.close();
    });

    describe('State', () => {
        it('FindAll Empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/state/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe estados cadastrados');
        });

        it('FindOne NotFound', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/state/findOne')
                .query({ estado: 'SP' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Estado não encontrado');
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/state/create')
                .send({ nome: 'sp' });

            expect(res.statusCode).toBe(201);
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

    describe('City', () => {
        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/city/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe cidades cadastradas');
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/city/findOne')
                .query({ cidade: 'Osasco' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Cidade não encontrada');
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/city/create')
                .send({ nome: 'Osasco', estado: 'SP' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_cidade: 1,
                nome: 'OSASCO',
                cod_estado: 1,
            });
        });

        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/city/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual([
                {
                    cod_cidade: 1,
                    nome: 'OSASCO',
                    cod_estado: 1,
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/city/findOne')
                .query({ cidade: 'Osasco' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_cidade: 1,
                nome: 'OSASCO',
                cod_estado: 1,
            });
        });

        it('Create Invalid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/city/create')
                .send({ nome: 'Osasco', estado: 'São Paulo' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'A sigla do estado deve ter 2 caracteres',
            ]);
        });
    });

    describe('Student', () => {
        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/student/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe alunos cadastrados');
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/student/findOne')
                .query({ nome: 'Kenji Sakai' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Aluno não encontrado');
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Kenji Sakai',
                    cpf: '00000000000',
                    telefone: '11988888888',
                    cep: '06220070',
                    estado: 'SP',
                    cidade: 'Osasco',
                    bairro: 'Munhoz',
                    rua: 'abc',
                    numero: '10',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_aluno: 1,
                nome: 'KENJI SAKAI',
                cpf: '00000000000',
                telefone: '11988888888',
                cep: '06220070',
                cod_cidade: 1,
                bairro: 'MUNHOZ',
                rua: 'ABC',
                numero: '10',
                complemento: null,
            });
        });

        it('Create CPF Existing', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Kenji Sakai',
                    cpf: '00000000000',
                    telefone: '11988888888',
                    cep: '06220070',
                    estado: 'SP',
                    cidade: 'Osasco',
                    bairro: 'Munhoz',
                    rua: 'abc',
                    numero: '10',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF já cadastrado');
        });

        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/student/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual([
                {
                    cod_aluno: 1,
                    nome: 'KENJI SAKAI',
                    cpf: '00000000000',
                    telefone: '11988888888',
                    cep: '06220070',
                    cod_cidade: 1,
                    bairro: 'MUNHOZ',
                    rua: 'ABC',
                    numero: '10',
                    complemento: null,
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/student/findOne')
                .query({ nome: 'Kenji Sakai' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_aluno: 1,
                nome: 'KENJI SAKAI',
                cpf: '00000000000',
                telefone: '11988888888',
                cep: '06220070',
                cod_cidade: 1,
                bairro: 'MUNHOZ',
                rua: 'ABC',
                numero: '10',
                complemento: null,
            });
        });

        it('Update', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'kenji sakai' })
                .send({
                    cpf: '33344455566',
                    telefone: '11999999999',
                    cep: '01230080',
                    estado: 'SP',
                    cidade: 'Novo Osasco',
                    bairro: 'Mapa Alameda dos Jamaris',
                    rua: 'Alagoa',
                    numero: '15',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_aluno: 1,
                nome: 'KENJI SAKAI',
                cpf: '33344455566',
                telefone: '11999999999',
                cep: '01230080',
                cod_cidade: 2,
                bairro: 'MAPA ALAMEDA DOS JAMARIS',
                rua: 'ALAGOA',
                numero: '15',
                complemento: null,
            });
        });

        it('Update CPF Existing', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'kenji sakai' })
                .send({
                    cpf: '33344455566',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF já cadastrado');
        });

        it('Create Invalid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Kenji Sakai',
                    cpf: '00000000000',
                    telefone: '11988888888',
                    cep: '06220070',
                    estado: 'São Paulo',
                    cidade: 'Osasco',
                    bairro: 'Munhoz',
                    rua: 'abc',
                    numero: '10',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'A sigla do estado deve ter 2 caracteres',
            ]);
        });
    });
});
2;
