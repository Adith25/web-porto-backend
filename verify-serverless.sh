#!/bin/bash
# Quick verification script for Vercel serverless setup

echo "🔍 Verifying NestJS Serverless Setup"
echo "======================================"
echo ""

# Check 1: Handler files exist
echo "✓ Checking handler files..."
if [ -f "api/[...route].ts" ]; then
  echo "  ✓ api/[...route].ts exists"
else
  echo "  ✗ api/[...route].ts missing"
  exit 1
fi

if [ -f "src/handler.ts" ]; then
  echo "  ✓ src/handler.ts exists"
else
  echo "  ✗ src/handler.ts missing"
fi

# Check 2: Vercel config exists
echo ""
echo "✓ Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
  echo "  ✓ vercel.json exists"
else
  echo "  ✗ vercel.json missing"
  exit 1
fi

# Check 3: Build test
echo ""
echo "✓ Testing build..."
if npm run build > /dev/null 2>&1; then
  echo "  ✓ Build successful"
  if [ -f "dist/main.js" ]; then
    echo "  ✓ dist/main.js compiled"
  fi
else
  echo "  ✗ Build failed"
  exit 1
fi

# Check 4: Prisma
echo ""
echo "✓ Checking Prisma setup..."
if [ -f "prisma/schema.prisma" ]; then
  echo "  ✓ prisma/schema.prisma exists"
else
  echo "  ✗ prisma/schema.prisma missing"
fi

if npx prisma generate > /dev/null 2>&1; then
  echo "  ✓ Prisma client generated"
else
  echo "  ✗ Prisma generation failed"
fi

# Check 5: Environment
echo ""
echo "✓ Checking environment..."
if [ -z "$DATABASE_URL" ]; then
  echo "  ⚠️  DATABASE_URL not set (required in Vercel)"
else
  echo "  ✓ DATABASE_URL is set"
fi

echo ""
echo "======================================"
echo "✅ Verification complete!"
echo ""
echo "Next steps for Vercel deployment:"
echo "1. Ensure .env has DATABASE_URL set"
echo "2. Push to Git: git push origin main"
echo "3. View deployment: vercel logs --tail"
echo "4. Test endpoint: curl https://your-project.vercel.app/"
