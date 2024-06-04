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

    describe('Teacher', () => {
        it('FindAll empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/teacher/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe professores cadastrados');
        });

        it('FindOne notFound', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/teacher/findOne')
                .query({ nome: 'Juliana Agatha Silva' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Professor não encontrado');
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/teacher/create')
                .send({
                    nome: 'Juliana Agatha Silva',
                    cpf: '43795242800',
                    telefone: '11985315760',
                    data_admissao: '2024-06-03',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_professor: 1,
                nome: 'JULIANA AGATHA SILVA',
                cpf: '43795242800',
                telefone: '11985315760',
                data_admissao: '2024-06-03T00:00:00.000Z',
            });
        });

        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/teacher/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual([
                {
                    cod_professor: 1,
                    nome: 'JULIANA AGATHA SILVA',
                    cpf: '43795242800',
                    telefone: '11985315760',
                    data_admissao: '2024-06-03T00:00:00.000Z',
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/teacher/findOne')
                .query({ nome: 'Juliana Agatha Silva' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_professor: 1,
                nome: 'JULIANA AGATHA SILVA',
                cpf: '43795242800',
                telefone: '11985315760',
                data_admissao: '2024-06-03T00:00:00.000Z',
            });
        });

        it('Create CPF Existing', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/teacher/create')
                .send({
                    nome: 'Analu Emanuelly Isabel Nascimento',
                    cpf: '43795242800',
                    telefone: '15982530950',
                    data_admissao: '2024-06-03',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF já cadastrado');
        });

        it('Create CPF invalid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/teacher/create')
                .send({
                    nome: 'Analu Emanuelly Isabel Nascimento',
                    cpf: '00000000000',
                    telefone: '15982530950',
                    data_admissao: '2024-06-03',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF inválido');
        });

        it('Update', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/teacher/update')
                .query({ nome: 'Juliana Agatha Silva' })
                .send({
                    nome: 'Heloisa Heloisa Elza',
                    cpf: '91908933879',
                    telefone: '11994339691',
                    data_admissao: '2024-06-04',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_professor: 1,
                nome: 'HELOISA HELOISA ELZA',
                cpf: '91908933879',
                telefone: '11994339691',
                data_admissao: '2024-06-04T00:00:00.000Z',
            });
        });

        it('Update CPF invalid', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/teacher/update')
                .query({ nome: 'Heloisa Heloisa Elza' })
                .send({ cpf: '00000000000' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF inválido');
        });

        it('Update CPF Existing', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/teacher/update')
                .query({ nome: 'Heloisa Heloisa Elza' })
                .send({ cpf: '91908933879' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF já cadastrado');
        });

        it('DTO', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/teacher/create')
                .send();

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'Nome é obrigatório',
                'O nome deve ser passado nesse campo',
                'CPF é obrigatório',
                'O CPF deve conter 11 números',
                'Telefone é obrigatório',
                'O Telefone deve conter de 10 a 11 números incluindo o DDD',
                'Data de admissão é obrigatório',
                'A data de admissão deve ser passado nesse campo',
            ]);
        });
    });
});
