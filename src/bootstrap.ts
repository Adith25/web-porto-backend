import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function createNestApp(expressApp: express.Application) {
  const uploadsPath = join(process.cwd(), 'uploads');
  const certificatesPath = join(uploadsPath, 'certificates');
  const cvPath = join(uploadsPath, 'cv');

  [uploadsPath, certificatesPath, cvPath].forEach((path) => {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
  });

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  nestApp.enableCors({
    origin: ['https://adityayufnanda.my.id', 'http://localhost:3000'],
    credentials: true,
  });

  nestApp.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await nestApp.init();

  return nestApp;
}
