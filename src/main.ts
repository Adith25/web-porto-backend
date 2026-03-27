import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const logger = new Logger('Main');

async function bootstrap() {
  const uploadsPath = join(process.cwd(), 'uploads');
  const certificatesPath = join(uploadsPath, 'certificates');
  const cvPath = join(uploadsPath, 'cv');

  [uploadsPath, certificatesPath, cvPath].forEach((path) => {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  });

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://adityayufnanda.my.id', 
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 🔥 SWAGGER SETUP (INI YANG PENTING)
  const config = new DocumentBuilder()
    .setTitle('Web Porto API')
    .setDescription('API documentation for portfolio backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  // 🔥 LISTEN HARUS DI PALING AKHIR
  const port = process.env.PORT || 3001;
  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}

bootstrap();
