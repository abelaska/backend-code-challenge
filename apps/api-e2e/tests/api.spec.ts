import type { FastifyInstance } from 'fastify';
import { getPort, waitForPort } from 'get-port-please';
import { execSync, ExecSyncOptions } from 'child_process';
import { join } from 'path';
import { GraphQLClient, gql } from 'graphql-request';
import { onSetup } from '@bcc/api';
import { fastifyBootstrap } from '@bcc/fastify-bootstrap';

describe('bootstrap', () => {
  let fastify: FastifyInstance;
  let client: GraphQLClient;

  beforeAll(async () => {
    const host = '127.0.0.1';
    const port = await getPort();

    const opts: ExecSyncOptions = {
      cwd: join(__dirname, '..', '..', '..'),
      stdio: 'inherit',
      env: process.env,
    };

    execSync('pnpm run --filter ./libs/prisma reset --skip-generate', opts);
    execSync('pnpm run --filter ./tools/prisma/seed seed', opts);

    ({ fastify } = await fastifyBootstrap({ onSetup, host, port }));

    await waitForPort(port, {
      host,
      delay: 100,
      retries: 50,
    });

    client = new GraphQLClient(`http://${host}:${port}/graphql`);
  }, 15000);

  afterAll(async () => {
    if (fastify) {
      await fastify.close();
    }
  }, 15000);

  it('should ping the server', async () => {
    const rsp = await fastify.inject({
      method: 'GET',
      path: '/health',
    });
    expect(rsp.statusCode).toBe(200);
    expect(await rsp.json()).toEqual({ env: 'test' });
  });

  it('should get list of pokemons types', async () => {
    const data = await client.request(gql`
      {
        pokemonTypes {
          name
        }
      }
    `);
    expect(data).toEqual({
      pokemonTypes: [
        {
          name: 'Bug',
        },
        {
          name: 'Dragon',
        },
        {
          name: 'Electric',
        },
        {
          name: 'Fairy',
        },
        {
          name: 'Fighting',
        },
        {
          name: 'Fire',
        },
        {
          name: 'Flying',
        },
        {
          name: 'Ghost',
        },
        {
          name: 'Grass',
        },
        {
          name: 'Ground',
        },
        {
          name: 'Ice',
        },
        {
          name: 'Normal',
        },
        {
          name: 'Poison',
        },
        {
          name: 'Psychic',
        },
        {
          name: 'Rock',
        },
        {
          name: 'Steel',
        },
        {
          name: 'Water',
        },
      ],
    });
  });

  it('should get pokemon by id', async () => {
    const data = await client.request(gql`
      {
        pokemonById(id: "1") {
          id
          name
        }
      }
    `);
    expect(data).toEqual({
      pokemonById: {
        id: '1',
        name: 'Bulbasaur',
      },
    });
  });

  it('should get pokemon by name', async () => {
    const data = await client.request(gql`
      {
        pokemonByName(name: "Bulbasaur") {
          id
          name
        }
      }
    `);
    expect(data).toEqual({
      pokemonByName: {
        id: '1',
        name: 'Bulbasaur',
      },
    });
  });

  it('should get list of pokemons by name', async () => {
    const data = await client.request(gql`
      {
        pokemons(input: { name: "saur" }) {
          id
          name
        }
      }
    `);
    expect(data).toEqual({
      pokemons: [
        {
          id: '1',
          name: 'Bulbasaur',
        },
        {
          id: '2',
          name: 'Ivysaur',
        },
        {
          id: '3',
          name: 'Venusaur',
        },
      ],
    });
  });

  it('should get list of favorite pokemons (empty)', async () => {
    const empty = await client.request(gql`
      {
        pokemons(input: { favorite: true }) {
          id
          name
        }
      }
    `);
    expect(empty).toEqual({
      pokemons: [],
    });
  });

  it('should get list of non-favorite pokemons (first page)', async () => {
    const empty = await client.request(gql`
      {
        pokemons(input: { favorite: false, skip: 0, take: 2 }) {
          id
          name
        }
      }
    `);
    expect(empty).toEqual({
      pokemons: [
        {
          id: '1',
          name: 'Bulbasaur',
        },
        {
          id: '2',
          name: 'Ivysaur',
        },
      ],
    });
  });

  it('should mutate favorite', async () => {
    const mutation = await client.request(gql`
      mutation {
        toggleFavorite(id: "1") {
          id
          favorite
        }
      }
    `);
    expect(mutation).toEqual({
      toggleFavorite: {
        id: '1',
        favorite: true,
      },
    });

    const updated = await client.request(gql`
      {
        pokemons(input: { favorite: true }) {
          id
          name
          favorite
        }
      }
    `);
    expect(updated).toEqual({
      pokemons: [
        {
          id: '1',
          name: 'Bulbasaur',
          favorite: true,
        },
      ],
    });

    const mutation2 = await client.request(gql`
      mutation {
        toggleFavorite(id: "1") {
          id
          favorite
        }
      }
    `);
    expect(mutation2).toEqual({
      toggleFavorite: {
        id: '1',
        favorite: false,
      },
    });

    const empty = await client.request(gql`
      {
        pokemons(input: { favorite: true }) {
          id
          name
          favorite
        }
      }
    `);
    expect(empty).toEqual({
      pokemons: [],
    });

    const pokemon = await client.request(gql`
    {
      pokemonById(id: "1") {
        id
        name
        favorite
      }
    }
  `);
    expect(pokemon).toEqual({
      pokemonById: {
        id: '1',
        name: 'Bulbasaur',
        favorite: false,
      },
    });
  });

  it('should get list of pokemons by types', async () => {
    const data = await client.request(gql`
      {
        pokemons(input: { types: ["Bug","Fire"] }) {
          id
          name
        }
      }
    `);
    expect(data).toEqual({
      pokemons: [
        {
          id: '4',
          name: 'Charmander',
        },
        {
          id: '5',
          name: 'Charmeleon',
        },
        {
          id: '6',
          name: 'Charizard',
        },
        {
          id: '10',
          name: 'Caterpie',
        },
        {
          id: '11',
          name: 'Metapod',
        },
        {
          id: '12',
          name: 'Butterfree',
        },
        {
          id: '13',
          name: 'Weedle',
        },
        {
          id: '14',
          name: 'Kakuna',
        },
        {
          id: '15',
          name: 'Beedrill',
        },
        {
          id: '37',
          name: 'Vulpix',
        },
      ],
    });
  });

  it('should get a page of pokemons', async () => {
    const page1 = await client.request(gql`
      {
        pokemons(input: { skip: 0, take: 2 }) {
          id
          name
        }
      }
    `);
    expect(page1).toEqual({
      pokemons: [
        {
          id: '1',
          name: 'Bulbasaur',
        },
        {
          id: '2',
          name: 'Ivysaur',
        },
      ],
    });

    const page2 = await client.request(gql`
      {
        pokemons(input: { skip: 2, take: 3 }) {
          id
          name
        }
      }
    `);
    expect(page2).toEqual({
      pokemons: [
        {
          id: '3',
          name: 'Venusaur',
        },
        {
          id: '4',
          name: 'Charmander',
        },
        {
          id: '5',
          name: 'Charmeleon',
        },
      ],
    });
  });
});
