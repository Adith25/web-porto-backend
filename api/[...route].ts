import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';
import { createNestApp } from '../src/bootstrap';

// Set environment early
process.env.VERCEL = 'true';

const expressApp = express();
let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    try {
      console.log('Starting NestJS initialization...');
      // Create and initialize NestJS app
      await createNestApp(expressApp);
      console.log('NestJS app created and initialized');

      // Wrap with serverless-http
      cachedServer = serverless(expressApp);
      console.log('✓ Serverless handler wrapped');
    } catch (error) {
      console.error('Failed to initialize handler:', error);
      throw error;
    }
  }

  return cachedServer;
}

export default async function handler(req: any, res: any) {
  // Simple health check to verify the handler works
  if (req.url === '/api/health') {
    return res.status(200).json({ status: 'ok', message: 'Handler is alive' });
  }

  try {
    const server = await bootstrap();
    return server(req, res);
  } catch (error) {
    console.error('Handler invocation error:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}

