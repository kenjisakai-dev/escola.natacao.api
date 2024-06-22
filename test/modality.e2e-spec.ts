import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('ModalityController (e2e)', () => {
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
            .get('/api/v1/school/modality/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Não existe modalidades cadastradas');
    });

    it('FindOne notFound', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/modality/findOne')
            .set('Authorization', token)
            .query({ cod_modalidade: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Modalidade não encontrada');
    });

    it('Create', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/modality/create')
            .set('Authorization', token)
            .send({
                descricao: 'Natação',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toStrictEqual({
            cod_modalidade: 1,
            descricao: 'NATAÇÃO',
            status: true,
        });
    });

    it('Create - Modality existing', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/modality/create')
            .set('Authorization', token)
            .send({
                descricao: 'Natação',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Modalidade já existente');
    });

    it('FindAll', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/modality/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual([
            {
                cod_modalidade: 1,
                descricao: 'NATAÇÃO',
                status: true,
            },
        ]);
    });

    it('FindOne', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/modality/findOne')
            .set('Authorization', token)
            .query({ cod_modalidade: 1 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_modalidade: 1,
            descricao: 'NATAÇÃO',
            status: true,
        });
    });

    it('Update', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/modality/update')
            .set('Authorization', token)
            .query({ cod_modalidade: 1 })
            .send({
                descricao: 'Natação I',
                status: false,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toStrictEqual({
            cod_modalidade: 1,
            descricao: 'NATAÇÃO I',
            status: false,
        });
    });

    it('Update - Modality existing', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/modality/update')
            .set('Authorization', token)
            .query({ cod_modalidade: 1 })
            .send({
                descricao: 'NATAÇÃO I',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Modalidade já existente');
    });

    it('DTO', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/modality/create')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toStrictEqual([
            'Modalidade é obrigatório',
            'A descrição da modalidade deve ser passado nesse campo',
        ]);
    });
});
