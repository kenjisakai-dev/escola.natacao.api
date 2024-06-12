import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('EmployeeController (e2e)', () => {
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

    describe('Student', () => {
        it('FindAll empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/employee/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe alunos cadastrados');
        });

        it('FindOne notFound', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/student/findOne')
                .query({ nome: 'Alessandra Lavínia Jaqueline da Rosa' });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Aluno não encontrado');
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Alessandra Lavínia Jaqueline da Rosa',
                    cpf: '03094550819',
                    telefone: '11986024259',
                    cep: '06090030',
                    numero: '421',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_aluno: 1,
                nome: 'ALESSANDRA LAVÍNIA JAQUELINE DA ROSA',
                cpf: '03094550819',
                telefone: '11986024259',
                cep: '06090030',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'CENTRO',
                rua: 'RUA AVELINO LOPES',
                numero: '421',
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
                    nome: 'ALESSANDRA LAVÍNIA JAQUELINE DA ROSA',
                    cpf: '03094550819',
                    telefone: '11986024259',
                    cep: '06090030',
                    estado: 'SP',
                    cidade: 'OSASCO',
                    bairro: 'CENTRO',
                    rua: 'RUA AVELINO LOPES',
                    numero: '421',
                    complemento: null,
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/student/findOne')
                .query({ nome: 'Alessandra Lavínia Jaqueline da Rosa' });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_aluno: 1,
                nome: 'ALESSANDRA LAVÍNIA JAQUELINE DA ROSA',
                cpf: '03094550819',
                telefone: '11986024259',
                cep: '06090030',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'CENTRO',
                rua: 'RUA AVELINO LOPES',
                numero: '421',
                complemento: null,
            });
        });

        it('Create CPF Existing', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Ayla Aurora Francisca Fogaça',
                    cpf: '03094550819',
                    telefone: '11994028816',
                    cep: '06090020',
                    numero: '276',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF já cadastrado');
        });

        it('Create CPF invalid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Ayla Aurora Francisca Fogaça',
                    cpf: '00000000000',
                    telefone: '11994028816',
                    cep: '06090020',
                    numero: '276',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF inválido');
        });

        it('Create CEP invalid', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Ayla Aurora Francisca Fogaça',
                    cpf: '32645840850',
                    telefone: '11994028816',
                    cep: '06090022',
                    numero: '276',
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
                    nome: 'Ayla Aurora Francisca Fogaça',
                    cpf: '32645840850',
                    telefone: '11994028816',
                    cep: '06090022',
                    estado: 'SP',
                    cidade: 'Osasco',
                    bairro: 'Centro',
                    rua: 'Avenida dos Autonomistas',
                    numero: '276',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_aluno: 2,
                nome: 'AYLA AURORA FRANCISCA FOGAÇA',
                cpf: '32645840850',
                telefone: '11994028816',
                cep: '06090022',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'CENTRO',
                rua: 'AVENIDA DOS AUTONOMISTAS',
                numero: '276',
                complemento: null,
            });
        });

        it('Update', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'Ayla Aurora Francisca Fogaça' })
                .send({
                    cpf: '77612538890',
                    cep: '06090020',
                    numero: '276',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_aluno: 2,
                nome: 'AYLA AURORA FRANCISCA FOGAÇA',
                cpf: '77612538890',
                telefone: '11994028816',
                cep: '06090020',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'CENTRO',
                rua: 'AVENIDA DOS AUTONOMISTAS',
                numero: '276',
                complemento: null,
            });
        });

        it('Update CPF invalid', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'Ayla Aurora Francisca Fogaça' })
                .send({ cpf: '00000000000' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF inválido');
        });

        it('Update CPF Existing', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'Ayla Aurora Francisca Fogaça' })
                .send({ cpf: '77612538890' });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CPF já cadastrado');
        });

        it('Update CEP without cep or number', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'Ayla Aurora Francisca Fogaça' })
                .send({
                    rua: 'Rua Ux 2',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('CEP e número é obrigatório');
        });

        it('Update CEP invalid', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'Ayla Aurora Francisca Fogaça' })
                .send({
                    cep: '13308299',
                    numero: '824',
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe(
                'CEP Inválido, será necessário passar o CEP, estado, cidade, bairro, rua e número',
            );
        });

        it('Update CEP invalid with address data Valid', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/student/update')
                .query({ nome: 'Ayla Aurora Francisca Fogaça' })
                .send({
                    cep: '13308299',
                    estado: 'sp',
                    cidade: 'Osasco',
                    bairro: 'Cidade Nova II',
                    rua: 'Rua Ux 2',
                    numero: '824',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_aluno: 2,
                nome: 'AYLA AURORA FRANCISCA FOGAÇA',
                cpf: '77612538890',
                telefone: '11994028816',
                cep: '13308299',
                estado: 'SP',
                cidade: 'OSASCO',
                bairro: 'CIDADE NOVA II',
                rua: 'RUA UX 2',
                numero: '824',
                complemento: null,
            });
        });

        it('DTO', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send();

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'Nome é obrigatório',
                'O nome deve ser passado nesse campo',
                'CPF é obrigatório',
                'O CPF deve conter 11 números',
                'Telefone é obrigatório',
                'O Telefone deve conter de 10 a 11 números incluindo o DDD',
                'CEP é obrigatório',
                'O CEP deve conter 8 números',
                'Número é obrigatório',
            ]);
        });
    });
});
