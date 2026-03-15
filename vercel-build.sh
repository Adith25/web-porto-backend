#!/bin/bash
# Vercel build script for NestJS backend
set -e

echo "Starting Vercel build for NestJS backend..."

# Install dependencies (done automatically by Vercel)
echo "Dependencies already installed by Vercel"

# Build NestJS application
echo "Building NestJS application..."
npm run build

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy || {
  echo "⚠️ Migration failed - this may be expected if database is not yet set up"
  echo "Please ensure DATABASE_URL is set in Vercel environment variables"
}

echo "✓ Build completed successfully"
