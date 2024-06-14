import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('RegistrationController (e2e)', () => {
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
                nome: 'Sabrina Rita Farias',
                cpf: '71889751839',
                telefone: '11983522207',
                data_admissao: '2024-05-15',
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

        await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send({
                cod_modalidade: 1,
                cod_professor: 1,
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/modality/teacher/create')
            .set('Authorization', token)
            .send({
                cod_modalidade: 2,
                cod_professor: 1,
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/class/create')
            .set('Authorization', token)
            .send({
                nome: 'Natação A2',
                horarios: 'seg/qua - 09:00 às 10:00',
                cod_modalidade_professor: 1,
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/class/create')
            .set('Authorization', token)
            .send({
                nome: 'Hidroginástica A3',
                horarios: 'seg/qua - 10:00 às 11:00',
                cod_modalidade_professor: 2,
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/student/create')
            .set('Authorization', token)
            .send({
                nome: 'Alessandra Lavínia Jaqueline da Rosa',
                cpf: '03094550819',
                telefone: '11986024259',
                cep: '06090030',
                numero: '421',
            });

        await request(app.getHttpServer())
            .post('/api/v1/school/student/create')
            .set('Authorization', token)
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
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Não existe matriculas cadastradas');
    });

    it('FindOne notFound', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/registration/findOne')
            .set('Authorization', token)
            .query({ cod_matricula: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Matricula não encontrada');
    });

    it('Create', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/registration/create')
            .set('Authorization', token)
            .send({
                data_matricula: '2024-06-07',
                cod_turma: 1,
                cod_aluno: 1,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toStrictEqual({
            cod_matricula: 1,
            data_matricula: '2024-06-07T00:00:00.000Z',
            cod_turma: 1,
            cod_aluno: 1,
        });
    });

    it('FindAll', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/registration/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([
            {
                cod_matricula: 1,
                data_matricula: '2024-06-07T00:00:00.000Z',
                cod_turma: 1,
                cod_aluno: 1,
            },
        ]);
    });

    it('FindOne', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/registration/findOne')
            .set('Authorization', token)
            .query({ cod_matricula: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_matricula: 1,
            data_matricula: '2024-06-07T00:00:00.000Z',
            cod_turma: 1,
            cod_aluno: 1,
        });
    });

    it('Update', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/registration/update')
            .set('Authorization', token)
            .query({ cod_matricula: 1 })
            .send({
                data_matricula: '2024-06-06',
                cod_turma: 2,
                cod_aluno: 2,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_matricula: 1,
            data_matricula: '2024-06-06T00:00:00.000Z',
            cod_turma: 2,
            cod_aluno: 2,
        });
    });

    it('DTO', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/registration/create')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual([
            'Código da modalidade_professor é obrigatório',
            'Código do aluno é obrigatório',
            'O código do aluno deve ser passado nesse campo',
        ]);
    });
});
