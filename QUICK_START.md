# ⚡ Quick Start: Deploy to Vercel

## Before You Deploy (5 Minutes)

### 1. Review Changes
All files have been created/modified. Review these key files:
- ✅ `api/[...route].ts` - Vercel serverless handler
- ✅ `src/handler.ts` - NestJS app exporter
- ✅ `vercel.json` - Vercel configuration
- ✅ `src/main.ts` - Updated for serverless (conditional bootstrap)
- ✅ `src/prisma/prisma.service.ts` - Serverless-optimized connection pooling
- ✅ `package.json` - Build script updated

### 2. Build Locally (Verify Everything Works)
```bash
npm run build
```
✅ Should complete in ~2 seconds with no errors

### 3. Commit Changes
```bash
git add .
git commit -m "Configure NestJS backend for Vercel serverless deployment"
git push origin main
```

---

## Deploy to Vercel (2 Minutes)

### Option A: Automatic Deployment (Recommended)
Your Git push will trigger automatic deployment on Vercel (if connected).

### Option B: Manual Deployment
```bash
npm install -g vercel
vercel --prod
```

---

## After Deployment (2 Minutes)

### 1. Monitor Build
```bash
vercel logs --tail
```
Wait for:
- ✅ Build completed successfully
- ✅ Prisma generated successfully
- ✅ No errors in logs

### 2. Test API Endpoint
```bash
# Get your Vercel URL from: https://vercel.com/dashboard
# Replace YOUR_PROJECT_URL below

curl https://YOUR_PROJECT_URL/

# Should return 404 (route not found) or a valid API response
# NOT a 500 error
```

### 3. Test Database Connection
```bash
curl https://YOUR_PROJECT_URL/admin/settings

# Should connect to database and return data or valid error
```

### 4. Update Frontend
Update your Nuxt app to use the new Vercel URL:
```typescript
// web_porto/nuxt.config.ts or composable
const API_URL = 'https://YOUR_PROJECT_URL'
```

---

## Environment Variables to Set in Vercel

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
DATABASE_URL = postgresql://user:password@host:port/database?sslmode=require
NODE_ENV = production
VERCEL = true
```

⚠️ **Important**: 
- Get `DATABASE_URL` from your PostgreSQL provider
- Ensure PostgreSQL accepts connections from Vercel IPs
- Use SSL: `sslmode=require` in connection string

---

## Troubleshooting

### "This serverless function has crashed"

**First, check logs:**
```bash
vercel logs --tail
```

**Common causes:**

1. **DATABASE_URL not set**
   - Fix: Set DATABASE_URL in Vercel environment variables
   
2. **Database unreachable**
   - Fix: Verify PostgreSQL allows Vercel IPs
   - Test locally: `npx prisma studio`

3. **Build failed**
   - Fix: Run locally: `npm run build`
   - Check dist/ folder exists with all files

4. **Module errors**
   - Fix: `npm install` then `npm run build`

### Test Locally First
```bash
npm run build
npm run start:prod
# Visit http://localhost:4000
```

---

## File Structure Check

After deployment, your Vercel project should have:

```
dist/
├── api/
│   └── [...route].js          ← This is Vercel's entry point
├── src/
│   ├── main.js                ← Local entry point (not used on Vercel)
│   ├── handler.js             ← Backup handler (not required)
│   ├── prisma/
│   │   └── prisma.service.js  ← Database connection
│   └── [other modules].js
└── node_modules/
```

Vercel automatically routes all requests to `dist/api/[...route].js`

---

## Success Indicators

✅ Deployment is successful when:
- Vercel logs show "Build completed successfully"
- No 500 errors in function logs
- API responds with either data or valid error response
- Database queries execute successfully
- Frontend can connect to the API

---

## Monitoring

After deployment goes live:

1. **Monitor Vercel Logs**
   ```bash
   vercel logs --tail
   ```

2. **Check Analytics**
   - Vercel Dashboard → Analytics

3. **Monitor Errors** (optional)
   - Integrate Sentry or similar service
   
4. **Check Database**
   - Monitor connections in PostgreSQL
   - Watch for connection pool exhaustion

---

## Rollback (If Needed)

If something goes wrong:

```bash
# Revert last commit
git revert HEAD
git push origin main

# Vercel auto-redeploys within seconds
```

---

## Next: Frontend Update

Update `web_porto/` to use the new backend URL:

```typescript
// In your API composable or Nuxt config
const backendUrl = process.env.VERCEL
  ? 'https://your-project.vercel.app'
  : 'http://localhost:4000'
```

---

## Questions?

- 📚 See: `SERVERLESS_DEPLOYMENT.md` (detailed guide)
- 📋 See: `DEPLOYMENT_CHECKLIST.md` (complete checklist)
- 📊 See: `IMPLEMENTATION_SUMMARY.md` (what was changed)

---

**You're all set! Deploy with confidence.** 🚀

---

**Commands Reference:**
```bash
# Local testing
npm run build
npm run start:prod

# Deployment
git push origin main
vercel logs --tail

# Verify
curl https://your-project.vercel.app/
```
