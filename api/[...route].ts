/* eslint-disable */
/**
 * Vercel Serverless Function Handler
 * This file is NOT compiled by NestJS - it's a Vercel-specific route handler
 * It imports the compiled NestJS app from dist/ and serves it
 */

import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';

const logger = new Logger('VercelHandler');

// Global app instance - reused across serverless invocations
let cachedApp: NestExpressApplication | null = null;

async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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

  await app.init();
  return app;
}

async function getApp(): Promise<NestExpressApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  logger.log('Initializing NestJS app for Vercel...');
  cachedApp = await createApp();
  logger.log('NestJS app ready');

  return cachedApp;
}

export default async (req: any, res: any) => {
  try {
    const app = await getApp();
    const server = app.getHttpAdapter().getInstance();
    return server(req, res);
  } catch (error) {
    logger.error('Request handler error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error : undefined,
    });
  }
};
