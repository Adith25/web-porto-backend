/**
 * Vercel Serverless Function Handler
 * Entry point for all API requests in Vercel serverless environment
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';

const logger = new Logger('VercelHandler');

// Global app instance cache
let cachedApp: NestExpressApplication | null = null;
let initPromise: Promise<NestExpressApplication> | null = null;

async function createApp(): Promise<NestExpressApplication> {
  logger.debug('Creating NestJS app instance...');
  
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Buffer logs for serverless environment
    bufferLogs: true,
  });

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

  // Initialize app (don't call .listen())
  await app.init();
  logger.log('✓ NestJS application initialized successfully');
  
  return app;
}

async function getApp(): Promise<NestExpressApplication> {
  if (cachedApp) {
    logger.debug('Reusing cached app instance');
    return cachedApp;
  }

  // Prevent multiple concurrent initializations
  if (initPromise) {
    logger.debug('Waiting for app initialization to complete...');
    return initPromise;
  }

  logger.log('Initializing NestJS app for Vercel serverless...');
  initPromise = createApp();
  
  try {
    cachedApp = await initPromise;
    logger.log('✓ App instance ready');
    return cachedApp;
  } catch (error) {
    logger.error('✗ Failed to initialize app', error);
    initPromise = null; // Reset on error so retry is possible
    throw error;
  }
}

export default async (req: any, res: any) => {
  try {
    logger.debug(`Handling ${req.method} ${req.url}`);
    
    const app = await getApp();
    const httpServer = app.getHttpAdapter();
    
    if (!httpServer) {
      throw new Error('HTTP adapter not available');
    }

    const server = httpServer.getInstance();
    
    if (!server) {
      throw new Error('Express server instance not available');
    }

    // Pass request to Express server
    return server(req, res);
  } catch (error) {
    logger.error('✗ Handler error:', error instanceof Error ? error.message : String(error));
    
    // Ensure we can send response
    if (!res.headersSent) {
      res.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { 
          error: error instanceof Error ? error.message : String(error)
        }),
      });
    }
  }
};
