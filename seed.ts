import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = 'postgresql://postgres:admin123@localhost:5432/portfolio_db';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  const adminCount = await prisma.admin.count();
  console.log(`Current admin count: ${adminCount}`);
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash('admin', 10);
    await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
      },
    });
    console.log('Seeded default admin (admin@example.com / admin)');
  } else {
    console.log('Admin already exists.');
    const admin = await prisma.admin.findFirst();
    console.log(`Existing admin email: ${admin?.email}`);
  }
}

seed()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
