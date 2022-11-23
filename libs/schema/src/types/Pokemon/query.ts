import { Prisma } from '@prisma/client';
import { prisma } from '@bcc/prisma';
import { builder } from '../../builder';
import { omitUndefined } from '../../lib/utils';

builder.queryType({
  fields: (t) => ({
    pokemonById: t.prismaField({
      type: 'Pokemon',
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (query, _root, args) =>
        prisma.pokemon.findUnique({
          ...query,
          where: { id: Number.parseInt(String(args.id), 10) },
        }),
    }),

    pokemonByName: t.prismaField({
      type: 'Pokemon',
      nullable: true,
      args: {
        name: t.arg.string({ required: true }),
      },
      resolve: (query, _root, args) =>
        prisma.pokemon.findUnique({
          ...query,
          where: { name: args.name },
        }),
    }),

    pokemonTypes: t.prismaField({
      type: ['PokemonType'],
      resolve: (query) => prisma.pokemonType.findMany({ ...query, orderBy: { name: 'asc' } }),
    }),

    pokemons: t.prismaFieldWithInput({
      type: ['Pokemon'],
      typeOptions: {
        name: 'PokemonsInputType',
      },
      input: {
        take: t.input.int(),
        skip: t.input.int(),
        name: t.input.string(),
        types: t.input.stringList(),
        favorite: t.input.boolean(),
      },
      nullable: true,
      resolve: async (query, _root, { input: { take, skip, name, types, favorite } }, _ctx, _info) =>
        prisma.pokemon.findMany({
          ...query,
          take: take ?? 10,
          skip: skip ?? 0,
          where: omitUndefined({
            ...(favorite && { favorite }),
            ...(name && { name: { contains: name } }),
            ...(types && {
              types: { some: { type: { name: { in: types } } } },
            }),
          } as Prisma.PokemonWhereInput),
        }),
    }),
  }),
});
