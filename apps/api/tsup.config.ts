import { defineConfig } from 'tsup';
import esbuildPinoPlugin from 'esbuild-plugin-pino';
import { join } from 'path';
import fsExtra from 'fs-extra';

const libPrismaDir = join(__dirname, '..', '..', 'libs', 'prisma');
const outDir = 'dist';

export default defineConfig({
  outDir,
  minify: true,
  sourcemap: true,
  keepNames: true,
  clean: true,
  platform: 'node',
  shims: false,
  skipNodeModulesBundle: false,
  entry: { index: 'src/main.ts' },
  external: [/node_modules/, /@prisma\/client/, /@opentelemetry/],
  noExternal: [
    /@bcc\//,
    /pino\/lib\/worker.js/,
    /pino\/file.js/,
    /pino\/lib\/worker-pipeline.js/,
    /thread-stream\/lib\/worker.js/,
  ],
  format: 'cjs',
  target: 'esnext',
  tsconfig: 'tsconfig.json',
  esbuildPlugins: [
    esbuildPinoPlugin({ transports: [] }),
    {
      name: 'copy-assets',
      setup(build) {
        build.onEnd((result) => {
          if (result.errors.length === 0) {
            fsExtra.copySync(join(libPrismaDir, 'schema.prisma'), join(outDir, 'schema.prisma'));
          }
        });
      },
    },
  ],
});
