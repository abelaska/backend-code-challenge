import { Prisma } from "@prisma/client";
import { prisma } from "@bcc/prisma";
import { builder } from "../../builder";
import { omitUndefined } from "../../lib/utils";

builder.queryType({
  fields: (t) => ({
    pokemonById: t.prismaField({
      type: "Pokemon",
      nullable: true,
      args: {
        id: t.arg.id({
          required: true,
          validate: {
            regex: /[0-9]+/,
          },
        }),
      },
      resolve: (query, _root, args) =>
        prisma.pokemon.findUnique({
          ...query,
          where: { id: Number.parseInt(String(args.id), 10) },
        }),
    }),

    pokemonByName: t.prismaField({
      type: "Pokemon",
      nullable: true,
      args: {
        name: t.arg.string({
          required: true,
          validate: {
            minLength: 1,
          },
        }),
      },
      resolve: (query, _root, args) =>
        prisma.pokemon.findUnique({
          ...query,
          where: { name: args.name },
        }),
    }),

    pokemonTypes: t.prismaField({
      type: ["PokemonType"],
      resolve: (query) =>
        prisma.pokemonType.findMany({ ...query, orderBy: { name: "asc" } }),
    }),

    pokemons: t.prismaFieldWithInput({
      type: ["Pokemon"],
      typeOptions: {
        name: "PokemonsInputType",
      },
      input: {
        take: t.input.int({
          validate: {
            min: 1,
            max: 100,
          },
        }),
        skip: t.input.int({
          validate: {
            min: 0,
          },
        }),
        name: t.input.string({
          validate: {
            minLength: 1,
          },
        }),
        types: t.input.stringList({
          validate: {
            items: {
              minLength: 1,
            },
            minLength: 1,
            maxLength: 100,
          },
        }),
        favorite: t.input.boolean(),
      },
      resolve: async (
        query,
        _root,
        { input: { take, skip, ...args } },
        _ctx,
        _info
      ) =>
        prisma.pokemon.findMany({
          ...query,
          take: take ?? 10,
          skip: skip ?? 0,
          where: pokemonsWhere(args),
        }),
    }),

    pokemonsConnection: t.prismaConnection({
      type: "Pokemon",
      cursor: "id",
      defaultSize: 20,
      maxSize: 100,
      args: {
        name: t.arg.string({
          validate: {
            minLength: 1,
          },
        }),
        types: t.arg.stringList({
          validate: {
            items: {
              minLength: 1,
            },
            minLength: 1,
            maxLength: 100,
          },
        }),
        favorite: t.arg.boolean(),
      },
      totalCount: (_parent, args) =>
        prisma.pokemon.count({
          where: pokemonsWhere(args),
        }),
      resolve: (query, _parent, args) =>
        prisma.pokemon.findMany({
          ...query,
          where: pokemonsWhere(args),
        }),
    }),
  }),
});

const pokemonsWhere = ({
  name,
  types,
  favorite,
}: {
  name?: string | null | undefined;
  types?: string[] | null | undefined;
  favorite?: boolean | null | undefined;
}) =>
  omitUndefined({
    ...(favorite !== undefined && { favorite }),
    ...(name && { name: { contains: name } }),
    ...(types && {
      types: { some: { type: { name: { in: types } } } },
    }),
  } as Prisma.PokemonWhereInput);
