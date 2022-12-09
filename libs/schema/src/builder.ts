import SchemaBuilder from '@pothos/core';
import WithInputPlugin from '@pothos/plugin-with-input';
import PrismaPlugin from '@pothos/plugin-prisma';
import ValidationPlugin from '@pothos/plugin-validation';
import RelayPlugin from '@pothos/plugin-relay';
import { prisma } from '@bcc/prisma';
import type { PrismaTypes } from '@bcc/prisma';
import type { GraphqlContext } from './context';

export const builder = new SchemaBuilder<{ PrismaTypes: PrismaTypes; Context: GraphqlContext }>({
  plugins: [PrismaPlugin, WithInputPlugin, ValidationPlugin, RelayPlugin],
  prisma: {
    client: prisma,
  },
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String',
  },
});
