import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

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
    origin: ['https://adityayufnanda.my.id', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;

  await app.listen(port);

  logger.log(`Server running on port ${port}`);
}

bootstrap();