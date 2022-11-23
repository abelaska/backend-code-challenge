import { builder } from '../../builder';

class MinMax {
  public readonly minimum: string;
  public readonly maximum: string;

  constructor(private readonly min: number, private readonly max: number, private readonly unit: string) {
    this.minimum = `${min}${unit}`;
    this.maximum = `${max}${unit}`;
  }
}

class PokemonWeightObject extends MinMax {
  constructor(min: number, max: number) {
    super(min, max, 'kg');
  }
}

class PokemonHeightObject extends MinMax {
  constructor(min: number, max: number) {
    super(min, max, 'm');
  }
}

class PokemonEvolutionRequirementsObject {
  constructor(public readonly name: string, public readonly amount: number) {}
}

export const PokemonWeight = builder.objectType(PokemonWeightObject, {
  name: 'PokemonWeight',
  description: 'Pokemon weight (minimum, maximum)',
  fields: (t) => ({
    minimum: t.exposeString('minimum'),
    maximum: t.exposeString('maximum'),
  }),
});

export const PokemonHeight = builder.objectType(PokemonHeightObject, {
  name: 'PokemonHeight',
  description: 'Pokemon height (minimum, maximum)',
  fields: (t) => ({
    minimum: t.exposeString('minimum'),
    maximum: t.exposeString('maximum'),
  }),
});

export const PokemonEvolutionRequirements = builder.objectType(PokemonEvolutionRequirementsObject, {
  name: 'PokemonEvolutionRequirements',
  description: 'Pokemon evolution requirements',
  fields: (t) => ({
    name: t.exposeString('name'),
    amount: t.exposeInt('amount'),
  }),
});

export const PokemonType = builder.prismaObject('PokemonType', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
  }),
});

export const Pokemon = builder.prismaObject('Pokemon', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    favorite: t.exposeBoolean('favorite'),
    fleeRate: t.float({ resolve: ({ fleeRate }) => fleeRate.toNumber() }),
    maxCP: t.exposeInt('maxCP'),
    maxHP: t.exposeInt('maxHP'),
    weight: t.field({
      type: PokemonWeight,
      select: {
        weightMinimum: true,
        weightMaximum: true,
      },
      resolve: ({ weightMinimum, weightMaximum }) =>
        new PokemonWeightObject(weightMinimum.toNumber(), weightMaximum.toNumber()),
    }),
    height: t.field({
      type: PokemonHeight,
      select: {
        heightMinimum: true,
        heightMaximum: true,
      },
      resolve: ({ heightMinimum, heightMaximum }) =>
        new PokemonHeightObject(heightMinimum.toNumber(), heightMaximum.toNumber()),
    }),
    evolutionRequirements: t.field({
      type: PokemonEvolutionRequirements,
      nullable: true,
      select: {
        evolutionRequirements: true,
        evolutionRequirementsAmount: true,
      },
      resolve: ({ evolutionRequirements, evolutionRequirementsAmount }) =>
        evolutionRequirements && evolutionRequirementsAmount
          ? new PokemonEvolutionRequirementsObject(evolutionRequirements.name, evolutionRequirementsAmount)
          : null,
    }),
    evolutions: t.relation('evolutions', { nullable: true }),
    previousEvolutions: t.relation('previousEvolutions', { nullable: true }),
    types: t.stringList({
      select: {
        types: {
          select: {
            type: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      resolve: ({ types }) => types?.map(({ type }) => type.name) ?? [],
    }),
    resistant: t.stringList({
      select: {
        resistant: {
          select: {
            feature: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      resolve: ({ resistant }) => resistant?.map(({ feature }) => feature.name) ?? [],
    }),
    weaknesses: t.stringList({
      select: {
        weaknesses: {
          select: {
            feature: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      resolve: ({ weaknesses }) => weaknesses?.map(({ feature }) => feature.name) ?? [],
    }),
  }),
});

export const PokemonEvolution = builder.prismaObject('PokemonEvolution', {
  fields: (t) => ({
    id: t.exposeID('id'),
    previousPokemon: t.relation('previousPokemon', {
      type: Pokemon,
      nullable: true,
    }),
    nextPokemon: t.relation('nextPokemon', { type: Pokemon, nullable: true }),
  }),
});
