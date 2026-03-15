import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

// Load AppModule from compiled source
let AppModule: any;

async function getAppModule() {
  if (!AppModule) {
    try {
      // Try loading from compiled dist first
      AppModule = (await import('../src/app.module')).AppModule;
    } catch (error) {
      console.error('Failed to load AppModule:', error);
      throw new Error('AppModule not found');
    }
  }
  return AppModule;
}

const expressApp = express();
let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    try {
      const appModule = await getAppModule();

      const nestApp = await NestFactory.create(
        appModule,
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

      cachedServer = serverless(expressApp);
    } catch (error) {
      console.error('NestJS initialization error:', error);
      throw error;
    }
  }

  return cachedServer;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
};
