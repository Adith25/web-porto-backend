import express from 'express';

export default async function handler(req: any, res: any) {
  const debug: any = {
    env: process.env.NODE_ENV,
    url: req.url,
    cwd: process.cwd(),
  };

  try {
    debug.step = 'Loading reflect-metadata';
    require('reflect-metadata');
    
    debug.step = 'Loading dotenv';
    require('dotenv/config');

    debug.step = 'Loading serverless-http';
    const serverless = require('serverless-http');

    debug.step = 'Loading bootstrap';
    const { createNestApp } = require('../src/bootstrap');

    debug.step = 'Initializing Express';
    const expressApp = express();
    
    debug.step = 'Initializing NestJS';
    await createNestApp(expressApp);

    debug.step = 'Wrapping serverless';
    const server = serverless(expressApp);

    debug.step = 'Invoking server';
    return server(req, res);

  } catch (error) {
    return res.status(500).json({
      error: 'Safe Loader Caught Error',
      step: debug.step,
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      debug
    });
  }
}


