import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

    await app.listen(3000);
}
bootstrap();
