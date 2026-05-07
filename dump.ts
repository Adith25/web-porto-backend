import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:admin123@localhost:5432/portfolio_db';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function dump() {
  const experiences = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  const aboutCards = await prisma.aboutCard.findMany({ orderBy: { order: 'asc' } });
  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  const certificates = await prisma.certificate.findMany({ orderBy: { order: 'asc' } });
  const settings = await prisma.siteSetting.findFirst();

  const data = {
    experiences,
    aboutCards,
    projects,
    certificates,
    settings
  };

  fs.writeFileSync('dump.json', JSON.stringify(data, null, 2));
  console.log('Dumped to dump.json');
}

dump()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
