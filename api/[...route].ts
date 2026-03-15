/**
 * Vercel Serverless Function Handler
 * This file is the entry point for all API requests in Vercel
 * Uses serverless-http to properly wrap the Express app with NestJS
 */

import 'reflect-metadata';
import 'dotenv/config';

// Ensure we're running in serverless mode
process.env.VERCEL = 'true';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import serverless from 'serverless-http';

const logger = new Logger('VercelHandler');

// Global cache for the serverless handler
let cachedServer: any = null;
let initPromise: Promise<any> | null = null;

async function bootstrap() {
  if (cachedServer) {
    logger.debug('Reusing cached serverless handler');
    return cachedServer;
  }

  if (initPromise) {
    logger.debug('Waiting for handler initialization');
    return initPromise;
  }

  logger.log('Initializing NestJS serverless handler...');

  initPromise = (async () => {
    try {
      // Dynamically import compiled AppModule at runtime
      const { AppModule } = await import('../dist/app.module');

      // Create Express app for NestJS to wrap
      const expressApp = express();

      // Create NestJS app with Express adapter
      const nestApp = await NestFactory.create(
        AppModule,
        new ExpressAdapter(expressApp),
      );

      // Configure NestJS
      nestApp.enableCors({
        origin: ['https://adityayufnanda.my.id', 'http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      });

      nestApp.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          transform: true,
        }),
      );

      // Initialize NestJS (don't call listen)
      await nestApp.init();

      logger.log('✓ NestJS app initialized');

      // Wrap Express app with serverless-http
      cachedServer = serverless(expressApp);

      logger.log('✓ Serverless handler ready');

      return cachedServer;
    } catch (error) {
      logger.error('Failed to initialize serverless handler', error);
      initPromise = null; // Reset on error so next invocation can retry
      throw error;
    }
  })();

  return initPromise;
}

export default async (req: any, res: any) => {
  try {
    logger.debug(`${req.method} ${req.url}`);
    const server = await bootstrap();
    return server(req, res);
  } catch (error) {
    logger.error('Handler error', error);

    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
      });
    }
  }
};
