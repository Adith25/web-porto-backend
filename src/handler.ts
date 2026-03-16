import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

// Global app instance - reused across serverless invocations
let cachedApp: NestExpressApplication;

async function createApp(): Promise<NestExpressApplication> {
  const uploadsPath = join(process.cwd(), 'uploads');
  const certificatesPath = join(uploadsPath, 'certificates');
  const cvPath = join(uploadsPath, 'cv');

  [uploadsPath, certificatesPath, cvPath].forEach((path) => {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['https://adityayufnanda.my.id', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Init all modules but don't listen
  await app.init();

  return app;
}

export async function getApp(): Promise<NestExpressApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  Logger.log('Creating NestJS app instance for Vercel serverless...');
  cachedApp = await createApp();
  Logger.log('NestJS app initialized successfully');

  return cachedApp;
}

// Express handler for Vercel serverless
export async function handler(req: any, res: any) {
  const app = await getApp();
  const server = app.getHttpAdapter().getInstance();

  return server(req, res);
}
