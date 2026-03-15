# NestJS Backend - Vercel Serverless Deployment Guide

## Overview

This backend has been configured to run as a serverless application on Vercel. The deployment has been optimized to work with Vercel's constraints and PostgreSQL database.

## Key Changes for Serverless Deployment

### 1. Serverless Handler (`src/handler.ts`)
- Exports a `handler` function that Vercel serverless functions expect
- Creates and caches a NestJS app instance across invocations for performance
- Reuses Express HTTP adapter for handling incoming requests

### 2. Updated Entry Point (`src/main.ts`)
- Only runs `app.listen()` in non-serverless environments (local development)
- Skips bootstrap when deployed to Vercel

### 3. Optimized PrismaService (`src/prisma/prisma.service.ts`)
- Implements global connection pool reuse across serverless invocations
- Configures minimal pool size (max: 1) suitable for serverless
- Sets proper timeout values for serverless constraints
- Skips disconnection in Vercel environment to preserve connections
- Handles admin seeding safely with error fallback

### 4. API Route Handler (`api/[...route].ts`)
- Catch-all route that routes all requests to the NestJS handler
- Enables Vercel to properly route requests to the application

### 5. Vercel Configuration (`vercel.json`)
- Defines build command with Prisma generation
- Sets maximum function duration to 30 seconds
- Configures rewrites for API and uploads routes

### 6. Build Optimization
- Updated `package.json` build script to include Prisma generation
- Added `.vercelignore` to exclude unnecessary files from deployment

## Deployment Instructions

### Step 1: Prepare Vercel Environment Variables

In your Vercel project settings, ensure these environment variables are set:

```
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
NODE_ENV=production
VERCEL=true
```

### Step 2: Configure Database

Before deployment, ensure:
1. PostgreSQL database is created and accessible from Vercel
2. Connection string is correct and includes SSL for Vercel
3. Run migrations locally to test: `npx prisma migrate deploy`

### Step 3: Deploy to Vercel

```bash
# Option 1: Push to your Git repository (Vercel auto-deploys)
git push origin main

# Option 2: Deploy directly
vercel --prod
```

### Step 4: Verify Deployment

After deployment:

1. Check Vercel logs:
   ```bash
   vercel logs --tail
   ```

2. Test the API endpoint:
   ```bash
   curl https://your-deployment.vercel.app/
   ```

3. Check database connectivity:
   ```bash
   curl https://your-deployment.vercel.app/admin/settings
   ```

## Troubleshooting

### Issue: "This serverless function has crashed"

**Check 1: Database Connection**
- Verify `DATABASE_URL` is set in Vercel environment
- Test locally: `npx prisma studio`
- Check if PostgreSQL accepts Vercel's IP address

**Check 2: Function Logs**
```bash
vercel logs --tail
```

**Check 3: Build Output**
- Ensure `dist/` folder is created with compiled code
- Verify `dist/handler.js` exists

### Issue: Database Connection Timeout

The serverless environment has strict connection limits:
- Max connections per pool: 1
- Connection timeout: 5 seconds
- Idle timeout: 30 seconds

If timeouts persist:
1. Check database is reachable from Vercel
2. Verify SSL/TLS configuration
3. Review PostgreSQL max connections setting

### Issue: Prisma Migrations Not Running

Migrations run during deployment via the build script. If they fail:
1. Check DATABASE_URL is correct
2. Ensure database user has migration permissions
3. Run manually via Vercel shell:
   ```bash
   vercel shell
   npx prisma migrate deploy
   ```

## Development vs. Production

### Local Development
```bash
npm run build
npm run start:prod
# Runs on port 4000 with app.listen()
```

### Vercel Production
```bash
vercel --prod
# Uses serverless handler, no app.listen()
```

## Performance Optimization

1. **Connection Pooling**: Global pool reused across invocations
2. **Module Caching**: NestJS app cached in-memory
3. **Function Duration**: Set to 30 seconds for Vercel Pro accounts
4. **Cold Start**: Optimized by caching app instance

## Security Considerations

1. **Environment Variables**: Use Vercel's secure variable storage
2. **Database SSL**: Enabled for Vercel deployments
3. **CORS**: Configured for frontend domain only
4. **Input Validation**: Global ValidationPipe enabled

## Additional Resources

- [Vercel Node.js Runtime](https://vercel.com/docs/functions/runtimes/node-js)
- [Prisma with Serverless](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/serverless-timeout-prevention)
- [NestJS Deployment](https://docs.nestjs.com/deployment)

## Monitoring

Monitor deployment health via:
1. Vercel Dashboard - Real-time logs and metrics
2. Database logs - Check for connection issues
3. Error tracking - Integrate Sentry or similar service

## Next Steps

After successful deployment, consider:
1. Setting up error tracking (Sentry)
2. Adding monitoring and alerts
3. Configuring custom domain
4. Setting up branch deployments for testing
