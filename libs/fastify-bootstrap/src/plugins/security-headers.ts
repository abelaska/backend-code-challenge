import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

// https://www.fastify.io/docs/latest/TypeScript/#creating-a-typescript-fastify-plugin

export const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
};

const plugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onRequest', async (_req, res) =>
    Object.entries(securityHeaders).map(([key, value]) => res.header(key, value)),
  );
};

export const fastifySecurityHeadersPlugin = fp(plugin, { name: 'security-headers' });
