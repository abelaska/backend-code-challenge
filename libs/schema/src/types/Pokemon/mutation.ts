import { prisma } from '@bcc/prisma';
import { builder } from '../../builder';

export default builder.mutationType({
  fields: (t) => ({
    toggleFavorite: t.prismaField({
      type: 'Pokemon',
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: async (query, _root, args) => {
        const id = Number.parseInt(String(args.id), 10);
        const pokemon = await prisma.pokemon.findUnique({
          select: { favorite: true },
          where: { id },
        });
        return prisma.pokemon.update({
          ...query,
          data: { favorite: !pokemon?.favorite },
          where: { id },
        });
      },
    }),
  }),
});
