import type { FastifyPluginAsync, RegisterOptions, RouteShorthandOptions } from 'fastify';
import fp from 'fastify-plugin';

export interface HealthPluginOptions extends RegisterOptions {}

const healthRouteOptions: RouteShorthandOptions = {
  schema: {
    response: {
      200: {
        properties: {
          app: {
            type: 'string',
          },
          version: {
            type: 'string',
          },
          env: {
            type: 'string',
          },
        },
        type: 'object',
      },
    },
  },
  logLevel: 'warn',
};

const plugin: FastifyPluginAsync<HealthPluginOptions> = async (fastify, options) => {
  fastify.get('/health', healthRouteOptions, async () => ({
    app: process.env.APP_NAME,
    version: process.env.APP_VERSION,
    env: process.env.NODE_ENV,
  }));
};

export const fastifyHealthPlugin = fp(plugin, { name: 'health' });
