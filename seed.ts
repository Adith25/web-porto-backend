import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:admin123@localhost:5432/portfolio_db';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  const adminCount = await prisma.admin.count();
  console.log(`Current admin count: ${adminCount}`);
  await prisma.admin.deleteMany({});
  const hashedPassword = await bcrypt.hash('admin', 10);
  await prisma.admin.create({
    data: {
      email: 'adith@gmail.com',
      password: hashedPassword,
    },
  });
  console.log('Seeded new admin (adith@gmail.com)');

  await prisma.aboutCard.deleteMany({});
  const initialAboutCards = [
    {
      title: 'Who I Am',
      content: `<p>I'm <strong>Muhammad Aditya Yufnanda</strong>, a Computer Engineer based in Tangerang, Banten, Indonesia. I'm specializing in <span class="text-violet-600 dark:text-violet-400">Web and Mobile Development</span>, <span class="text-violet-600 dark:text-violet-400">Machine Learning</span> and <span class="text-violet-600 dark:text-violet-400">Embedded Systems</span>.</p><br><p>I have hands-on experience across the full development stack — from building scalable web and mobile applications to training ML models and designing IoT systems. I strengthened my cloud skills through <strong>Bangkit Academy (Google, Tokopedia, Gojek & Traveloka)</strong> and front-end expertise through <strong>Dicoding Indonesia</strong>.</p>`,
      icon: '',
      textColor: 'text-gray-600 dark:text-gray-400',
      order: 0,
    },
    {
      title: 'Career Objective',
      content: `<p>To apply my multidisciplinary background in Web & Mobile Development, Machine Learning, and Embedded Systems to build impactful, real-world solutions — and grow as an engineer who bridges software intelligence with physical hardware.</p>`,
      icon: 'mdi:target',
      textColor: 'text-gray-600 dark:text-gray-400',
      order: 1,
    },
    {
      title: 'Education',
      content: `<div><p class="font-medium text-gray-900 dark:text-white">Universitas Syiah Kuala</p><p class="text-sm mt-1">Bachelor of Engineering (B.E.)</p><p class="text-xs text-gray-500 mt-1 font-mono">Computer Engineering (2021 – 2025)</p></div>`,
      icon: 'mdi:school-outline',
      textColor: 'text-gray-600 dark:text-gray-400',
      order: 2,
    },
  ];

  for (const card of initialAboutCards) {
    await prisma.aboutCard.create({ data: card });
  }
  console.log('Seeded initial About Cards');

  // Seed default site settings
  const existingSetting = await prisma.siteSetting.findFirst();
  if (!existingSetting) {
    await prisma.siteSetting.create({
      data: {
        id: 1,
        announcementText: "Hey there! 🚀 I'm currently looking for new opportunities.",
        announcementActive: true,
      }
    });
    console.log('Seeded default SiteSetting');
  } else {
    console.log('SiteSetting already exists');
  }
}

seed()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
