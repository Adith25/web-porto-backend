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
      const error = 'DATABASE_URL environment variable is not set';
      logger.error(error);
      throw new Error(error);
    }

    logger.log(`Connecting to PostgreSQL: ${connectionString.split('@')[1] || 'unknown'}`);

    try {
      globalPool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        // Serverless-optimized pool settings
        max: 1, // Limit connections in serverless
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });

      globalPool.on('error', (err) => {
        logger.error('Unexpected error on idle client', err);
      });

      globalPool.on('connect', () => {
        logger.debug('New PostgreSQL connection established');
      });

      logger.log('PostgreSQL pool created successfully');
    } catch (error) {
      logger.error('Failed to create PostgreSQL pool', error);
      throw error;
    }
  }
  return globalPool;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    logger.log('Initializing PrismaService...');
    try {
      const pool = getOrCreatePool();
      const adapter = new PrismaPg(pool);
      super({ adapter });
      logger.log('PrismaClient initialized with PostgreSQL adapter');
    } catch (error) {
      logger.error('Failed to initialize PrismaClient', error);
      throw error;
    }
  }

  async onModuleInit() {
    logger.log('PrismaService.onModuleInit() called');
    try {
      // Only connect/initialize once per module lifecycle
      if (!initPromise) {
        initPromise = this.initializeConnection();
      }
      await initPromise;
      logger.log('✓ PrismaService initialized');
    } catch (error) {
      logger.error('✗ Failed to initialize Prisma Service', error);
      throw error;
    }
  }

  private async initializeConnection() {
    logger.log('Attempting database connection...');
    try {
      await this.$connect();
      logger.log('✓ Prisma connected to database');
      await this.seedAdmin();
    } catch (error) {
      logger.error('✗ Prisma connection failed', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async onModuleDestroy() {
    logger.log('PrismaService.onModuleDestroy() called');
    // Don't disconnect in serverless environment to reuse connection
    if (!process.env.VERCEL) {
      try {
        await this.$disconnect();
        logger.log('Prisma disconnected');
      } catch (error) {
        logger.warn('Error disconnecting Prisma', error);
      }
    } else {
      logger.log('Skipping disconnect in Vercel serverless (connection will be reused)');
    }
  }

  private async seedAdmin() {
    logger.log('Checking for admin user...');
    try {
      const adminCount = await this.admin.count();
      if (adminCount === 0) {
        logger.log('No admin found, creating default admin...');
        const hashedPassword = await bcrypt.hash('admin', 10);
        await this.admin.create({
          data: {
            email: 'admin@example.com',
            password: hashedPassword,
          },
        });
        logger.log('✓ Seeded default admin (admin@example.com / admin)');
      } else {
        logger.log(`✓ Admin user exists (${adminCount} admin(s))`);
      }
    } catch (error) {
      logger.warn('Failed to seed admin user or admin already exists', error instanceof Error ? error.message : String(error));
      // Don't throw - admin might already exist
    }
  }
}


