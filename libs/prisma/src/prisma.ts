import { PrismaClient } from '@prisma/client';
import { join } from 'path';

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL ?? `file:${join(process.cwd(), 'dev.db')}`,
    },
  },
});
