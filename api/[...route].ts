import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import serverless from 'serverless-http';

// Set environment early
process.env.VERCEL = 'true';

const expressApp = express();
let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    try {
      // Import bootstrap function from source
      const { createNestApp } = await import('../src/bootstrap');

      // Create and initialize NestJS app
      await createNestApp(expressApp);

      // Wrap with serverless-http
      cachedServer = serverless(expressApp);

      console.log('✓ Serverless handler initialized');
    } catch (error) {
      console.error('Failed to initialize handler:', error);
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
    console.error('Handler invocation error:', error);
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

