import { fastify as createFastify } from 'fastify';
import { execSync, ExecSyncOptions } from 'child_process';
import { join } from 'path';
import { onSetup } from '@bcc/api';

describe('api-e2e', () => {
  const fastify = createFastify();

  const graphql = async (query: string) => {
    const rsp = await fastify.inject({
      url: '/graphql',
      method: 'POST',
      payload: { query },
    });
    expect(rsp.statusCode).toBe(200);
    return rsp.json().data;
  };

  beforeAll(async () => {
    const opts: ExecSyncOptions = {
      cwd: join(__dirname, '..', '..', '..'),
      stdio: 'inherit',
    };
    execSync('pnpm run --filter ./libs/prisma reset --skip-generate', opts);
    execSync('pnpm run --filter ./tools/prisma/seed seed', opts);

    await onSetup({ fastify });
  }, 15000);

  it('should get list of pokemons types', async () => {
    const data = await graphql(`
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
    const data = await graphql(`
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
    const data = await graphql(`
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
    const data = await graphql(`
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
    const empty = await graphql(`
      {
        pokemons(input: { favorite: true }) {
          id
          name
        }
      }
    `);
    expect(empty).toEqual({ pokemons: [] });
  });

  it('should get list of non-favorite pokemons (first page)', async () => {
    const empty = await graphql(`
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
    const mutation = await graphql(`
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

    const updated = await graphql(`
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

    const mutation2 = await graphql(`
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

    const empty = await graphql(`
      {
        pokemons(input: { favorite: true }) {
          id
          name
          favorite
        }
      }
    `);
    expect(empty).toEqual({ pokemons: [] });

    const pokemon = await graphql(`
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
    const data = await graphql(`
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
    const page1 = await graphql(`
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

    const page2 = await graphql(`
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
