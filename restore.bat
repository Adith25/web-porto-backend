@echo off
cd /d d:\Project\backend
set DATABASE_URL=postgres://ad33ee6b23fd7ac91db94b5991e25d9f6149bd482515be7040ecc917bde56e89:sk_Y9MVDuPWdYEdHLguUvrRR@db.prisma.io:5432/postgres?sslmode=require
echo Regenerating Prisma client...
call npx prisma generate
echo.
echo Running restoration...
call npx ts-node prisma/restore-data.ts

