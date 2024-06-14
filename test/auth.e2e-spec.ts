import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

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
    });

    it('Login', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/auth/login')
            .send({
                email: 'lorena_jesus@school.com.br',
                senha: 'lorena123',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.acessToken).not.toBeNull();
    });

    it('Login email invalid', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/auth/login')
            .send({
                email: 'lorena@school.com.br',
                senha: 'lorena123',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Email inválido');
    });

    it('Login password invalid', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/auth/login')
            .send({
                email: 'lorena_jesus@school.com.br',
                senha: 'lorena789',
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe('Senha incorreta');
    });
});
