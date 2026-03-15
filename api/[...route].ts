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
      console.log('Initializing NestJS for Vercel...');
      await createNestApp(expressApp);
      cachedServer = serverless(expressApp);
      console.log('✓ NestJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NestJS:', error);
      throw error;
    }
  }
  return cachedServer;
}

export default async function handler(req: any, res: any) {
  try {
    const server = await bootstrap();
    return server(req, res);
  } catch (error) {
    console.error('Critical Handler Error:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error during NestJS initialization',
      error: error instanceof Error ? error.message : String(error),
    });
  }
}



