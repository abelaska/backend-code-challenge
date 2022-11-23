import type { FastifyInstance } from 'fastify';
import { getPort, waitForPort } from 'get-port-please';
import { fastifyBootstrap } from '../src';

describe('bootstrap', () => {
  let fastify: FastifyInstance;

  beforeAll(async () => {
    const host = '127.0.0.1';
    const port = await getPort();

    ({ fastify } = await fastifyBootstrap({ host, port }));

    await waitForPort(port, {
      host,
      delay: 100,
      retries: 50,
    });
  });

  afterAll(async () => {
    if (fastify) {
      fastify.close();
    }
  });

  it('should ping the server', async () => {
    const rsp = await fastify.inject({
      method: 'GET',
      path: '/health',
    });
    expect(rsp.statusCode).toBe(200);
    expect(await rsp.json()).toEqual({ env: 'test' });
  });
});
