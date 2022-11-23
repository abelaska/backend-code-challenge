import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const plugin: FastifyPluginAsync = async (fastify) => {
  const close = (signal: unknown) => {
    fastify.log.info({ signal }, 'triggering close hook');
    fastify.close();
  };

  process.on('SIGINT', close);
  process.on('SIGTERM', close);
};

export const shutdownPlugin = fp(plugin, { name: 'shutdown' });
