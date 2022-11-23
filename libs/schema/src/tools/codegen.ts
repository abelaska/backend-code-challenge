import fs from 'node:fs';
import path from 'node:path';
import { printSchema, parse } from 'graphql';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptOperationsPlugin from '@graphql-codegen/typescript-operations';
import * as schemaAstPlugin from '@graphql-codegen/schema-ast';
import { codegen } from '@graphql-codegen/core';
import { CodegenPlugin, Types } from '@graphql-codegen/plugin-helpers';
import { schema as genSchema } from '../schema';
import * as fsExtra from 'fs-extra';

const schema = parse(printSchema(genSchema));

const generate = async (args: {
  filename: string;
  pluginMap: Record<string, CodegenPlugin>;
}) => {
  const { filename, pluginMap } = args;
  const config: Types.GenerateOptions = {
    documents: [],
    config: {},
    filename,
    schema,
    plugins: Object.keys(pluginMap).map((name) => ({ [name]: {} })),
    pluginMap,
  };

  const output = await codegen(config);

  await fsExtra.mkdirp(path.dirname(filename));
  await fs.promises.writeFile(filename, output, 'utf-8');
};

(async function main() {
  await Promise.all([
    generate({
      filename: path.join(__dirname, '..', 'generated', 'operations.ts'),
      pluginMap: {
        typescript: typescriptPlugin,
        typescriptOperations: typescriptOperationsPlugin,
      },
    }),
    generate({
      filename: path.join(__dirname, '..', '..', 'schema.graphql'),
      pluginMap: {
        schemaAst: schemaAstPlugin,
      },
    }),
  ]);
})().catch((error) => {
  console.error('Codegen failed', error);
  process.exit(1);
});
