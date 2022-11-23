import type { FastifyRequest, FastifyReply } from 'fastify';

export interface GraphqlContext {
  request: FastifyRequest;
  reply: FastifyReply;
}
