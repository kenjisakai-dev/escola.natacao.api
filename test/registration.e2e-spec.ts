import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('RegistrationController (e2e)', () => {
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

    describe('Class', () => {
        it('Create Data', async () => {
            await request(app.getHttpServer())
                .post('/api/v1/school/teacher/create')
                .send({
                    nome: 'Sabrina Rita Farias',
                    cpf: '71889751839',
                    telefone: '11983522207',
                    data_admissao: '2024-05-15',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/modality/create')
                .send({
                    descricao: 'Natação',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/modality/create')
                .send({
                    descricao: 'Hidroginástica',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/modality/teacher/create')
                .send({
                    modalidade: 'Natação',
                    professor: 'Sabrina Rita Farias',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/modality/teacher/create')
                .send({
                    modalidade: 'Hidroginástica',
                    professor: 'Sabrina Rita Farias',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/class/create')
                .send({
                    nome: 'Natação A2',
                    horarios: 'seg/qua - 09:00 às 10:00',
                    cod_modalidade_professor: 1,
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/class/create')
                .send({
                    nome: 'Hidroginástica A3',
                    horarios: 'seg/qua - 10:00 às 11:00',
                    cod_modalidade_professor: 2,
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/student/create')
                .send({
                    nome: 'Alessandra Lavínia Jaqueline da Rosa',
                    cpf: '03094550819',
                    telefone: '11986024259',
                    cep: '06090030',
                    numero: '421',
                });

            await request(app.getHttpServer())
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
        });

        it('FindAll empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/registration/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe matriculas cadastradas');
        });

        it('FindOne notFound', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/registration/findOne')
                .query({ cod_matricula: 1 });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Matricula não encontrada');
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/registration/create')
                .send({
                    data: '2024-06-07',
                    cod_turma: 1,
                    aluno: 'Alessandra Lavínia Jaqueline da Rosa',
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toStrictEqual({
                cod_matricula: 1,
                data: '2024-06-07T00:00:00.000Z',
                cod_turma: 1,
                cod_aluno: 1,
            });
        });

        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/registration/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual([
                {
                    cod_matricula: 1,
                    data: '2024-06-07T00:00:00.000Z',
                    cod_turma: 1,
                    cod_aluno: 1,
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/registration/findOne')
                .query({ cod_matricula: 1 });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_matricula: 1,
                data: '2024-06-07T00:00:00.000Z',
                cod_turma: 1,
                cod_aluno: 1,
            });
        });

        it('Update', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/registration/update')
                .query({ cod_matricula: 1 })
                .send({
                    data: '2024-06-06',
                    cod_turma: 2,
                    aluno: 'Ayla Aurora Francisca Fogaça',
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_matricula: 1,
                data: '2024-06-06T00:00:00.000Z',
                cod_turma: 2,
                cod_aluno: 2,
            });
        });

        it('DTO', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/registration/create')
                .send();

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toStrictEqual([
                'Código da modalidade_professor é obrigatório',
                'Nome do aluno é obrigatório',
                'O nome do aluno deve ser passado nesse campo',
            ]);
        });
    });
});
