import { FastifyInstance, FastifyServerOptions, FastifyListenOptions, fastify } from 'fastify';
import Fastify from 'fastify';
import fastifyOpenTelemetryPlugin from '@autotelic/fastify-opentelemetry';

import { createLoggerOptions } from './logger';
import { fastifyHealthPlugin, fastifySecurityHeadersPlugin, shutdownPlugin } from './plugins';

export const commonTracingIgnoreRoutes = ['/health', '/favicon.ico'];

export type FastifyBootstrapOnSetup = (
  services: FastifyServices,
  serverListenOptions: FastifyListenOptions,
) => Promise<void>;

export type FastifyBootstrapOnListening = (
  services: FastifyServices,
  serverListenOptions: FastifyListenOptions,
) => Promise<void>;

export interface FastifyServices {
  fastify: FastifyInstance;
}

export interface FastifyBootstrapOptions {
  port?: number;
  host?: string;

  fastifyOptions?: FastifyServerOptions;
  tracingIgnoreRoutes?: string[];

  onSetup?: FastifyBootstrapOnSetup;
  onListening?: FastifyBootstrapOnListening;
}

function fastifyCreate(opts: FastifyBootstrapOptions): FastifyInstance {
  const fastify: FastifyInstance = Fastify({
    trustProxy: true,
    exposeHeadRoutes: true,
    logger: createLoggerOptions(),
    ...opts.fastifyOptions,
  });
  return fastify;
}

async function fastifySetup(fastify: FastifyInstance, options: FastifyBootstrapOptions): Promise<FastifyServices> {
  const tracingIgnoreRoutes = [...commonTracingIgnoreRoutes, ...(options.tracingIgnoreRoutes ?? [])];

  // Register core plugins
  fastify.register(fastifyOpenTelemetryPlugin, {
    wrapRoutes: true,
    ignoreRoutes: (path, method) => method === 'OPTIONS' || tracingIgnoreRoutes.includes(path),
    formatSpanName: (request) => `${request.url} - ${request.method}`,
  });
  fastify.register(fastifyHealthPlugin);
  fastify.register(fastifySecurityHeadersPlugin);
  fastify.register(shutdownPlugin);

  return { fastify };
}

async function fastifyListen(services: FastifyServices, options: FastifyBootstrapOptions) {
  const { onSetup, onListening } = options;

  const port = options.port ?? parseInt(process.env.SERVER_PORT ?? '3000', 10);
  const host = options.host ?? process.env.SERVER_HOST ?? '0.0.0.0';
  const listenOptions = { host, port };

  if (onSetup) {
    await onSetup(services, listenOptions);
  }

  // Start the server
  await services.fastify.listen(listenOptions);

  if (onListening) {
    await onListening(services, listenOptions);
  }

  return services;
}

export function fastifyBootstrap(options: FastifyBootstrapOptions) {
  const fastify = fastifyCreate(options);
  return fastifySetup(fastify, options)
    .then((services) => fastifyListen(services, options))
    .catch((error) => {
      fastify.log.error(error, 'Startup failed');
      process.exit(1);
    });
}
