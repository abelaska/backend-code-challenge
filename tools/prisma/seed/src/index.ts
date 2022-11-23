import { join } from 'path';
import { readFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

import { flatten, stringWithUnitsToNumber } from './lib/utils';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export interface Pokemon {
  id: string;
  name: string;
  fleeRate: number;
  maxCP: number;
  maxHP: number;
  types: string[];
  resistant: string[];
  weaknesses: string[];
  classification: string;
  attacks: Record<string, { name: string; type: string; damage: number }[]>;
  weight: {
    minimum: string;
    maximum: string;
  };
  height: {
    minimum: string;
    maximum: string;
  };
  evolutionRequirements?: {
    amount: number;
    name: string;
  };
  'Previous evolution(s)'?: {
    id: number;
    name: string;
  }[];
  evolutions?: {
    id: number;
    name: string;
  }[];
}

async function main() {
  const pokemons: Pokemon[] = JSON.parse(readFileSync(join(__dirname, '..', 'pokemons.json'), 'utf-8'));

  const pokemonData: Prisma.PokemonCreateInput[] = pokemons.map(
    ({
      name,
      weight,
      height,
      fleeRate,
      maxCP,
      maxHP,
      evolutionRequirements,
      attacks,
      classification,
      types,
      resistant,
      weaknesses,
    }) => ({
      name,
      weightMinimum: stringWithUnitsToNumber(weight.minimum),
      weightMaximum: stringWithUnitsToNumber(weight.maximum),
      heightMinimum: stringWithUnitsToNumber(height.minimum),
      heightMaximum: stringWithUnitsToNumber(height.maximum),
      fleeRate,
      maxCP,
      maxHP,

      classification: {
        connectOrCreate: {
          create: {
            name: classification,
          },
          where: {
            name: classification,
          },
        },
      },

      types: {
        create: types.map((name) => ({
          type: {
            connectOrCreate: {
              create: {
                name,
              },
              where: {
                name,
              },
            },
          },
        })),
      },

      resistant: {
        create: resistant.map((name) => ({
          feature: {
            connectOrCreate: {
              create: {
                name,
              },
              where: {
                name,
              },
            },
          },
        })),
      },

      weaknesses: {
        create: weaknesses.map((name) => ({
          feature: {
            connectOrCreate: {
              create: {
                name,
              },
              where: {
                name,
              },
            },
          },
        })),
      },

      evolutionRequirementsAmount: evolutionRequirements?.amount,
      evolutionRequirements: evolutionRequirements && {
        connectOrCreate: {
          create: {
            name: evolutionRequirements.name,
          },
          where: {
            name: evolutionRequirements.name,
          },
        },
      },

      attacks: {
        create: flatten(
          Object.entries(attacks).map(([category, attacks]) =>
            attacks.map((attack) => ({
              attack: {
                connectOrCreate: {
                  create: {
                    name: attack.name,
                    damage: attack.damage,
                    type: {
                      connectOrCreate: {
                        create: {
                          name: attack.type,
                        },
                        where: {
                          name: attack.type,
                        },
                      },
                    },
                    category: {
                      connectOrCreate: {
                        create: {
                          name: category,
                        },
                        where: {
                          name: category,
                        },
                      },
                    },
                  },
                  where: { name: attack.name },
                },
              },
            })),
          ),
        ),
      },
    }),
  );

  for (const data of pokemonData) {
    const pokemon = await prisma.pokemon.create({ data, select: { id: true } });
    console.log(`Created pokemon with id: ${pokemon.id}`);
  }

  const nextPokemonData: Prisma.PokemonEvolutionCreateInput[] = flatten(
    pokemons
      .filter((poke) => poke.evolutions?.length)
      .map(
        (poke) =>
          poke.evolutions?.map((evolution) => ({
            pokemon: {
              connect: {
                name: poke.name,
              },
            },
            nextPokemon: {
              connect: {
                name: evolution.name,
              },
            },
          })) ?? [],
      ),
  );

  const prevPokemonData: Prisma.PokemonEvolutionCreateInput[] = flatten(
    pokemons
      .filter((poke) => poke['Previous evolution(s)']?.length)
      .map(
        (poke) =>
          poke['Previous evolution(s)']?.map((evolution) => ({
            pokemon: {
              connect: {
                name: poke.name,
              },
            },
            nextPokemon: {
              connect: {
                name: evolution.name,
              },
            },
          })) ?? [],
      ),
  );

  const pokemonEvolutionData = [...nextPokemonData, ...prevPokemonData];

  for (const data of pokemonEvolutionData) {
    const pokemonEvolution = await prisma.pokemonEvolution.create({
      data,
      select: { id: true },
    });
    console.log(`Created pokemon evolution with id: ${pokemonEvolution.id}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
