import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});
const adapter = new PrismaPg(pool);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.seedAdmin();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async seedAdmin() {
    const adminCount = await this.admin.count();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      await this.admin.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
        },
      });
      console.log('Seeded default admin (admin@example.com / admin)');
    }
  }
}

