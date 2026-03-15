import 'dotenv/config';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const logger = new Logger('PrismaService');

// Global pool instance for connection reuse across serverless invocations
let globalPool: Pool | null = null;
let initPromise: Promise<void> | null = null;

function getOrCreatePool(): Pool {
  if (!globalPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    globalPool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      // Serverless-optimized pool settings
      max: 1, // Limit connections in serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    globalPool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
    });
  }
  return globalPool;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = getOrCreatePool();
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      // Only connect/initialize once per module lifecycle
      if (!initPromise) {
        initPromise = this.initializeConnection();
      }
      await initPromise;
    } catch (error) {
      logger.error('Failed to initialize Prisma Service', error);
      throw error;
    }
  }

  private async initializeConnection() {
    try {
      await this.$connect();
      logger.log('Prisma connected to database');
      await this.seedAdmin();
    } catch (error) {
      logger.error('Prisma connection failed', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    // Don't disconnect in serverless environment to reuse connection
    if (process.env.VERCEL !== 'true') {
      await this.$disconnect();
      logger.log('Prisma disconnected');
    }
  }

  private async seedAdmin() {
    try {
      const adminCount = await this.admin.count();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash('admin', 10);
        await this.admin.create({
          data: {
            email: 'admin@example.com',
            password: hashedPassword,
          },
        });
        logger.log('Seeded default admin (admin@example.com / admin)');
      }
    } catch (error) {
      logger.warn('Failed to seed admin user or admin already exists', error);
      // Don't throw - admin might already exist
    }
  }
}


