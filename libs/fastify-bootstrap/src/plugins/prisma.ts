import type { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export interface FastifyPrismaPluginOptions {
  prisma: PrismaClient;
}

const plugin: FastifyPluginAsync<FastifyPrismaPluginOptions> = async (
  fastify,
  { prisma }: FastifyPrismaPluginOptions,
) => {
  await prisma.$connect();

  fastify.decorate('prisma', prisma);

  fastify.addHook('onClose', async (server) => {
    server.log.info('Disconnecting Prisma from DB');
    await server.prisma.$disconnect();
  });
};

export const fastifyPrismaPlugin = fp(plugin, { name: 'prisma' });
