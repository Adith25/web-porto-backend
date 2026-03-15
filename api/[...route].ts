/**
 * Vercel Serverless Function Handler
 * This file is the entry point for all API requests in Vercel
 * It initializes NestJS and routes requests through Express
 */

import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Global app instance - reused across invocations
let appInstance: NestExpressApplication | null = null;
let initPromise: Promise<NestExpressApplication> | null = null;

async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

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

  // Initialize app without listening
  await app.init();

  return app;
}

async function getApp(): Promise<NestExpressApplication> {
  if (appInstance) {
    return appInstance;
  }

  if (!initPromise) {
    initPromise = createApp();
  }

  try {
    appInstance = await initPromise;
    return appInstance;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    // Reset promise on error so next invocation can retry
    initPromise = null;
    throw error;
  }
}

export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    const app = await getApp();
    const server = app.getHttpAdapter().getInstance();
    
    if (!server) {
      throw new Error('Express server not initialized');
    }

    // Handle the request with Express
    return server(req, res);
  } catch (error) {
    console.error('[Vercel Handler] Error:', error);
    
    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
};
