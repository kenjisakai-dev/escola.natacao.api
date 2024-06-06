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
                    descricao: 'Natação II',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/modality/create')
                .send({
                    descricao: 'Hidroginástica',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/modality/teacher/create')
                .send({
                    modalidade: 'Natação II',
                    professor: 'Sabrina Rita Farias',
                });

            await request(app.getHttpServer())
                .post('/api/v1/school/modality/teacher/create')
                .send({
                    modalidade: 'Hidroginástica',
                    professor: 'Sabrina Rita Farias',
                });
        });

        it('FindAll empty', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/class/findAll')
                .send();

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Não existe turmas cadastradas');
        });

        it('FindOne notFound', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/class/findOne')
                .query({ cod_turma: 1 });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Turma não encontrada');
        });

        it('Create', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/class/create')
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
            });
        });

        it('Create cod_mod_tea nonexistent', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/class/create')
                .send({
                    nome: 'Natação A2',
                    horarios: 'seg/qua - 09:00 às 10:00',
                    cod_modalidade_professor: 5,
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe(
                'Código da modalidade_professor não encontrado',
            );
        });

        it('FindAll', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/class/findAll')
                .send();

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual([
                {
                    cod_turma: 1,
                    nome: 'NATAÇÃO A2',
                    horarios: 'SEG/QUA - 09:00 ÀS 10:00',
                    cod_modalidade_professor: 1,
                },
            ]);
        });

        it('FindOne', async () => {
            const res = await request(app.getHttpServer())
                .get('/api/v1/school/class/findOne')
                .query({ cod_turma: 1 });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_turma: 1,
                nome: 'NATAÇÃO A2',
                horarios: 'SEG/QUA - 09:00 ÀS 10:00',
                cod_modalidade_professor: 1,
            });
        });

        it('Update', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/class/update')
                .query({ cod_turma: 1 })
                .send({
                    cod_modalidade_professor: 2,
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                cod_turma: 1,
                nome: 'NATAÇÃO A2',
                horarios: 'SEG/QUA - 09:00 ÀS 10:00',
                cod_modalidade_professor: 2,
            });
        });

        it('Update cod_mod_tea nonexistent', async () => {
            const res = await request(app.getHttpServer())
                .patch('/api/v1/school/class/update')
                .query({ nome: 'Natação A2' })
                .send({
                    cod_modalidade_professor: 5,
                });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe(
                'Código da modalidade_professor não encontrado',
            );
        });

        it('DTO', async () => {
            const res = await request(app.getHttpServer())
                .post('/api/v1/school/class/create')
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
});
