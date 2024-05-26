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

    afterEach(async () => {
        await app.close();
    });

    describe('Student', () => {
        it('FindAll empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/student/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe alunos cadastrados');
        });

        it('FindOne notFound', async () => {
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
                    cep: '06230070',
                    numero: '10',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_aluno: 1,
                nome: 'KENJI SAKAI',
                cpf: '00000000000',
                telefone: '11988888888',
                cep: '06230070',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'PIRATININGA',
                rua: 'RUA BENEDITO DE MORAES',
                numero: '10',
                complemento: null,
            });
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
                    cep: '06230070',
                    estado: 'SP',
                    cidade: 'OSASCO',
                    bairro: 'PIRATININGA',
                    rua: 'RUA BENEDITO DE MORAES',
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
                cep: '06230070',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'PIRATININGA',
                rua: 'RUA BENEDITO DE MORAES',
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

        it('Create CEP invalid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Kenji Sakai',
                    cpf: '00000000000',
                    telefone: '11988888888',
                    cep: '06230077',
                    numero: '10',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(
                'CEP Inválido, será necessário passar o CEP, estado, cidade, bairro e rua',
            );
        });

        it('Create CEP invalid with address data Valid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Carla Sakai',
                    cpf: '44444444444',
                    telefone: '11955555555',
                    cep: '06230077',
                    estado: 'SP',
                    cidade: 'Osasco',
                    bairro: 'Presidente Altino',
                    rua: 'Rua Maria Carmem Panica',
                    numero: '23',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_aluno: 2,
                nome: 'CARLA SAKAI',
                cpf: '44444444444',
                telefone: '11955555555',
                cep: '06230077',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'PRESIDENTE ALTINO',
                rua: 'RUA MARIA CARMEM PANICA',
                numero: '23',
                complemento: null,
            });
        });

        it('Update', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'kenji sakai' })
                .send({
                    cpf: '99999999999',
                    telefone: '11922222222',
                    cep: '06280070',
                    numero: '15',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_aluno: 1,
                nome: 'KENJI SAKAI',
                cpf: '99999999999',
                telefone: '11922222222',
                cep: '06280070',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'AYROSA',
                rua: 'RUA AVINHADO',
                numero: '15',
                complemento: null,
            });
        });

        it('Update CEP without cep or number', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'kenji sakai' })
                .send({
                    cidade: 'Osasco',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CEP e número é obrigatório');
        });

        it('Update CEP invalid', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'kenji sakai' })
                .send({
                    cep: '06290077',
                    numero: '34',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(
                'CEP Inválido, será necessário passar o CEP, estado, cidade, bairro, rua e número',
            );
        });

        it('Update CEP invalid with address data Valid', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'Carla Sakai' })
                .send({
                    nome: 'Carla Sakai',
                    cep: '06220077',
                    estado: 'SP',
                    cidade: 'Osasco',
                    bairro: 'ROCHDATE',
                    rua: 'RUA SERGIPE',
                    numero: '102',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_aluno: 2,
                nome: 'CARLA SAKAI',
                cpf: '44444444444',
                telefone: '11955555555',
                cep: '06220077',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'ROCHDATE',
                rua: 'RUA SERGIPE',
                numero: '102',
                complemento: null,
            });
        });

        it('Update CPF Existing', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'kenji sakai' })
                .send({
                    cpf: '99999999999',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF já cadastrado');
        });

        it('Create DTO Invalid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send();

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'Nome é obrigatório',
                'O nome deve ser passado nesse campo',
                'CPF é obrigatório',
                'Telefone é obrigatório',
                'CEP é obrigatório',
                'O CEP deve conter 8 números',
                'Número é obrigatório',
            ]);
        });
    });
});
2;
