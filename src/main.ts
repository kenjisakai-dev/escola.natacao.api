import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import conf from './config/environment';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('School Swimming')
        .setDescription('The School Swimming API description')
        .setVersion('1.0')
        .addBearerAuth({
            description: 'Token acess',
            name: 'Authorization',
            bearerFormat: 'Bearer',
            scheme: 'bearer',
            type: 'http',
            in: 'Header',
        })
        .addTag('employee')
        .addTag('auth')
        .addTag('student')
        .addTag('teacher')
        .addTag('modality')
        .addTag('modalityTeacher')
        .addTag('team')
        .addTag('registration')
        .addTag('frequency')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);

    const port = conf.port ?? 3000;

    await app.listen(port);

    Logger.log(
        `APP started: http://localhost:${port}/api/v1/school/`,
        'NestApplication',
    );

    Logger.log(
        `Documentation swagger: http://localhost:${port}/swagger`,
        'Swagger',
    );
}
bootstrap();
