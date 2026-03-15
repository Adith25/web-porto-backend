# Vercel Deployment Checklist

## Pre-Deployment

### 1. Local Verification
- [ ] Run `npm run build` successfully
- [ ] Run `npx prisma generate` successfully  
- [ ] Database connection works locally: `npx prisma studio`
- [ ] API works locally: `npm run start:prod`
- [ ] Frontend can connect to local API

### 2. Code Preparation
- [ ] All changes committed to Git
- [ ] No uncommitted changes: `git status`
- [ ] Push to repository: `git push origin main`

### 3. Vercel Project Setup
- [ ] Project connected to Vercel (linked to Git repo)
- [ ] Environment variables configured in Vercel:
  ```
  DATABASE_URL = postgresql://user:password@host:port/db?sslmode=require
  NODE_ENV = production
  VERCEL = true
  ```
- [ ] All sensitive variables secured in Vercel

### 4. Database Preparation
- [ ] PostgreSQL database created and accessible
- [ ] Database user has migration permissions
- [ ] Connection string tested locally
- [ ] SSL/TLS certificate trusted (for Vercel connections)
- [ ] Backups taken before migration

## Deployment

### 5. Deploy to Vercel
- [ ] Automatic deployment via Git (recommended):
  ```bash
  git push origin main
  # Vercel auto-deploys via webhook
  ```

- OR manual deployment:
  ```bash
  npm install -g vercel
  vercel --prod
  ```

### 6. Monitor Deployment
- [ ] Check Vercel deployment logs:
  ```bash
  vercel logs --tail
  ```
- [ ] Verify build completed successfully
- [ ] Verify Prisma migration ran
- [ ] No errors in function logs

## Post-Deployment

### 7. Verify Functionality
- [ ] API endpoint is accessible:
  ```bash
  curl https://your-project.vercel.app/
  ```
- [ ] Database connection works:
  ```bash
  curl https://your-project.vercel.app/admin/settings
  ```
- [ ] Frontend can reach backend:
- [ ] CORS is working correctly
- [ ] File uploads work (if applicable)

### 8. Monitoring Setup
- [ ] Enable Vercel analytics
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up performance monitoring
- [ ] Test error scenarios

### 9. Rollback Plan (if needed)
```bash
# Redeploy previous version
git revert HEAD
git push origin main

# Or from Git history
vercel --prod --from-git-commit=<commit-hash>
```

## Troubleshooting

### If deployment fails:

1. **Build Error**
   - Check `vercel logs --tail`
   - Verify dependencies: `npm install`
   - Test locally: `npm run build`

2. **Runtime 500 Error**
   - Check logs: `vercel logs --tail`
   - Verify DATABASE_URL in Vercel env vars
   - Test database connectivity
   - Check Prisma migrations: `npx prisma migrate status`

3. **Database Connection Timeout**
   - Verify PostgreSQL accepts Vercel IPs
   - Check connection string format
   - Review database firewall rules
   - Test SSL: `psql "sslmode=require" $DATABASE_URL`

4. **Module Not Found**
   - Rebuild: `npm run build`
   - Clear cache: `vercel env pull --environment=production`
   - Reinstall dependencies

## Files Created/Modified

### New Files
- `api/[...route].ts` - Vercel serverless handler
- `src/handler.ts` - NestJS app exporter (backup handler)
- `vercel.json` - Vercel configuration
- `.vercelignore` - Files to exclude from deployment
- `SERVERLESS_DEPLOYMENT.md` - Detailed guide
- `verify-serverless.sh` - Verification script

### Modified Files
- `src/main.ts` - Skip bootstrap in serverless
- `src/prisma/prisma.service.ts` - Serverless-optimized connection pooling
- `package.json` - Build script and @vercel/node dependency

## Success Indicators

✅ Deployment successful when:
- Vercel build completes without errors
- API endpoint returns 200 responses
- Database queries work
- Frontend successfully communicates with backend
- No 500 errors in production logs

## Additional Commands

```bash
# View logs
vercel logs --tail

# Check environment variables
vercel env list

# Update environment variables
vercel env add DATABASE_URL

# Test function locally
vercel dev

# Rebuild and redeploy
vercel --prod --force

# View analytics
vercel analytics
```

## Need Help?

- Vercel Docs: https://vercel.com/docs
- NestJS Docs: https://docs.nestjs.com
- Prisma Serverless: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/serverless-timeout-prevention
- Check logs: `vercel logs --tail`
