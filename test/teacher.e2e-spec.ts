import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('TeacherController (e2e)', () => {
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

    it('FindAll empty', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/teacher/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Não existe professores cadastrados');
    });

    it('FindOne notFound', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/teacher/findOne')
            .set('Authorization', token)
            .query({ cod_professor: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Professor não encontrado');
    });

    it('Create', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/teacher/create')
            .set('Authorization', token)
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
            status: true,
        });
    });

    it('FindAll', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/teacher/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([
            {
                cod_professor: 1,
                nome: 'JULIANA AGATHA SILVA',
                cpf: '43795242800',
                telefone: '11985315760',
                data_admissao: '2024-06-03T00:00:00.000Z',
                status: true,
            },
        ]);
    });

    it('FindOne', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/teacher/findOne')
            .set('Authorization', token)
            .query({ cod_professor: 1 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_professor: 1,
            nome: 'JULIANA AGATHA SILVA',
            cpf: '43795242800',
            telefone: '11985315760',
            data_admissao: '2024-06-03T00:00:00.000Z',
            status: true,
        });
    });

    it('Create - CPF Existing', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/teacher/create')
            .set('Authorization', token)
            .send({
                nome: 'Analu Emanuelly Isabel Nascimento',
                cpf: '43795242800',
                telefone: '15982530950',
                data_admissao: '2024-06-03',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('CPF já cadastrado');
    });

    it('Create - CPF invalid', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/teacher/create')
            .set('Authorization', token)
            .send({
                nome: 'AAA',
                cpf: '00000000000',
                telefone: '00000000000',
                data_admissao: '2024-06-03',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('CPF inválido');
    });

    it('Update', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/teacher/update')
            .set('Authorization', token)
            .query({ cod_professor: 1 })
            .send({
                nome: 'Heloisa Heloisa Elza',
                cpf: '91908933879',
                telefone: '11994339691',
                data_admissao: '2024-06-04',
                status: false,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_professor: 1,
            nome: 'HELOISA HELOISA ELZA',
            cpf: '91908933879',
            telefone: '11994339691',
            data_admissao: '2024-06-04T00:00:00.000Z',
            status: false,
        });
    });

    it('Update - non-existent teacher', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/teacher/update')
            .set('Authorization', token)
            .query({ cod_professor: 1000 })
            .send({
                nome: 'Heloisa Heloisa Elza',
                cpf: '91908933879',
                telefone: '11994339691',
                data_admissao: '2024-06-04',
                status: false,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Professor não encontrado');
    });

    it('Update - CPF Existing', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/teacher/update')
            .set('Authorization', token)
            .query({ cod_professor: 1 })
            .send({
                nome: 'Analu Emanuelly Isabel Nascimento',
                cpf: '91908933879',
                telefone: '15982530950',
                data_admissao: '2024-06-03',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('CPF já cadastrado');
    });

    it('Update - CPF invalid', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/teacher/update')
            .set('Authorization', token)
            .query({ cod_professor: 1 })
            .send({
                nome: 'AAA',
                cpf: '00000000000',
                telefone: '00000000000',
                data_admissao: '2024-06-03',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('CPF inválido');
    });

    it('DTO', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/teacher/create')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual([
            'Nome é obrigatório',
            'O nome deve ser passado nesse campo',
            'CPF é obrigatório',
            'O CPF deve conter 11 números',
            'Telefone é obrigatório',
            'O Telefone deve conter de 10 a 11 números incluindo o DDD',
        ]);
    });
});
