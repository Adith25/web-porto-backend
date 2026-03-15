/**
 * Vercel Serverless Function Handler
 * Entry point for all API requests
 * Re-exports the compiled NestJS handler from dist/src/handler.js
 */

module.exports = require('../dist/src/handler').handler;
