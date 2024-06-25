import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('EmployeeController (e2e)', () => {
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
                permissao: 2,
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

    it('Create', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/employee/create')
            .set('Authorization', token)
            .send({
                nome: 'Julia Mariana Lavínia Aparício',
                email: 'julia-aparicio70@afsn.com.br',
                senha: 'gD1Pm4zjZo',
                permissao: 1,
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.acessToken).not.toBeNull();
        expect(typeof res.body.acessToken).toBe('string');
    });

    it('Create - Email existing', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/employee/create')
            .set('Authorization', token)
            .send({
                nome: 'Julia Mariana Lavínia Aparício',
                email: 'julia-aparicio70@afsn.com.br',
                senha: 'gD1Pm4zjZo',
                permissao: 1,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Email já cadastrado');
    });

    it('FindAll', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/employee/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);

        expect(res.body[0].cod_funcionario).toBe(1);
        expect(res.body[0].nome).toBe('LORENA STEFANY FÁTIMA JESUS');
        expect(res.body[0].email).toBe('lorena_jesus@school.com.br');
        expect(res.body[0].senha).not.toBeNaN();
        expect(res.body[0].senha).not.toBe('lorena123');
        expect(res.body[0].permissao).toBe(2);
        expect(res.body[0].status).toBe(true);

        expect(res.body[1].cod_funcionario).toBe(2);
        expect(res.body[1].nome).toBe('JULIA MARIANA LAVÍNIA APARÍCIO');
        expect(res.body[1].email).toBe('julia-aparicio70@afsn.com.br');
        expect(res.body[1].senha).not.toBeNaN();
        expect(res.body[1].senha).not.toBe('gD1Pm4zjZo');
        expect(res.body[1].permissao).toBe(1);
        expect(res.body[1].status).toBe(true);
    });

    it('FindOne', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/employee/findOne')
            .set('Authorization', token)
            .query({ cod_funcionario: 2 });

        expect(res.statusCode).toBe(200);

        expect(res.body.cod_funcionario).toBe(2);
        expect(res.body.nome).toBe('JULIA MARIANA LAVÍNIA APARÍCIO');
        expect(res.body.email).toBe('julia-aparicio70@afsn.com.br');
        expect(res.body.senha).not.toBeNaN();
        expect(res.body.permissao).toBe(1);
    });

    it('Update', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/employee/update')
            .set('Authorization', token)
            .query({ cod_funcionario: 2 })
            .send({
                email: 'julia-aparicio@afsn.com.br',
                permissao: 2,
                status: false,
            });

        expect(res.body.cod_funcionario).toBe(2);
        expect(res.body.nome).toBe('JULIA MARIANA LAVÍNIA APARÍCIO');
        expect(res.body.email).toBe('julia-aparicio@afsn.com.br');
        expect(res.body.senha).not.toBeNaN();
        expect(res.body.permissao).toBe(2);
        expect(res.body.status).toBe(false);
    });

    it('Update - non-existent employee', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/employee/update')
            .set('Authorization', token)
            .query({ cod_funcionario: 1000 })
            .send({
                nome: 'AAA',
                email: 'julia-aparicio@afsn.com.br',
                senha: '000000',
                permissao: 1,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Funcionário não encontrado');
    });

    it('Update - Email existing', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/employee/update')
            .set('Authorization', token)
            .query({ cod_funcionario: 1 })
            .send({
                nome: 'AAA',
                email: 'julia-aparicio@afsn.com.br',
                senha: '000000',
                permissao: 1,
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Email já cadastrado');
    });

    it('FindAll empty', async () => {
        await prismaService.funcionario.deleteMany();

        const res = await request(app.getHttpServer())
            .get('/api/v1/school/employee/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Não existe funcionários cadastrados');
    });

    it('FindOne notFound', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/employee/findOne')
            .set('Authorization', token)
            .query({ cod_funcionario: 2 });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Funcionário não encontrado');
    });

    it('DTO', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/employee/create')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual([
            'Nome é obrigatório',
            'O nome deve ser passado nesse campo',
            'Email é obrigatório',
            'O email deve ser passado nesse campo',
            'Senha é obrigatório',
            'A senha deve ter no minimo 6 caracteres',
        ]);
    });
});
