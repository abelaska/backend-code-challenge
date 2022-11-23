const { join, resolve } = require('path');

/** @type {import('jest').Config} */
module.exports = {
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)'],
  transform: {
    '^.+\\.[tj]s$': [
      'esbuild-jest',
      {
        sourcemap: true,
        target: 'esnext',
      },
    ],
  },
  moduleNameMapper: {
    '^@bcc/(.*)$': resolve(join(__dirname, 'libs', '$1', 'src')),
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [
    // ESM packages imported by tests should be mentioned here, because they
    // have to be transformed for Jest to CommonJS format.
    // Usually Jest failes with error `Cannot use import statement outside a module` for ESM packages,
    // that's a signal for you to add the package to this array.
    '/node_modules/(?!(got))/',
  ],
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['html'],
  passWithNoTests: true,
  detectOpenHandles: true,
};
