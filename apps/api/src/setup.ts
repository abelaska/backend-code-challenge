import type { FastifyBootstrapOnSetup } from '@bcc/fastify-bootstrap';
import type { FastifyRequest, FastifyReply } from 'fastify';
import fastifyMercuriusPlugin from 'mercurius';

import { fastifyPrismaPlugin } from '@bcc/fastify-bootstrap';
import type { GraphqlContext } from '@bcc/schema';
import { schema } from '@bcc/schema';
import { prisma } from '@bcc/prisma';

export const onSetup: FastifyBootstrapOnSetup = async ({ fastify }) => {
  fastify.register(fastifyPrismaPlugin, { prisma });
  fastify.register(fastifyMercuriusPlugin, {
    schema,
    path: '/graphql',
    graphiql: false,
    context: (request: FastifyRequest, reply: FastifyReply): GraphqlContext => ({
      request,
      reply,
    }),
  });
};
