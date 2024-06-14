import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('StudentController (e2e)', () => {
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
            .get('/api/v1/school/student/findAll')
            .set('Authorization', token)
            .send();

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Não existe alunos cadastrados');
    });

    it('FindOne notFound', async () => {
        const res = await request(app.getHttpServer())
            .get('/api/v1/school/student/findOne')
            .set('Authorization', token)
            .query({ cod_aluno: 1 });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe('Aluno não encontrado');
    });

    it('Create', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/student/create')
            .set('Authorization', token)
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
            .set('Authorization', token)
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
            .set('Authorization', token)
            .query({ cod_aluno: 1 });

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

    it('CPF Existing', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/student/create')
            .set('Authorization', token)
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

    it('CPF invalid', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/student/create')
            .set('Authorization', token)
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

    it('CEP invalid', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/student/create')
            .set('Authorization', token)
            .send({
                nome: 'Ayla Aurora Francisca Fogaça',
                cpf: '32645840850',
                telefone: '11994028816',
                cep: '06090022',
                numero: '276',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(
            'CEP Inválido, será necessário passar o estado, cidade, bairro, rua e número junto com o CEP',
        );
    });

    it('CEP invalid with address data valids', async () => {
        const res = await request(app.getHttpServer())
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
            .set('Authorization', token)
            .query({ cod_aluno: 2 })
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

    it('Update CEP without cep or number residential', async () => {
        const res = await request(app.getHttpServer())
            .patch('/api/v1/school/student/update')
            .set('Authorization', token)
            .query({ cod_aluno: 2 })
            .send({
                rua: 'Rua Ux 2',
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe(
            'O CEP e número residencial é obrigatório',
        );
    });

    it('DTO', async () => {
        const res = await request(app.getHttpServer())
            .post('/api/v1/school/student/create')
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
            'CEP é obrigatório',
            'O CEP deve conter 8 números',
            'Número é obrigatório',
        ]);
    });
});
