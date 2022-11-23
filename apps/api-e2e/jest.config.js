const { tmpdir } = require('os');
const { join, resolve } = require('path');

process.env.DATABASE_URL = `file:${join(tmpdir(), `bcc-api-test-${new Date().valueOf()}.db`)}`;

/** @type {import('jest').Config} */
module.exports = {
  displayName: 'api-e2e',
  coverageDirectory: '../../coverage/apps/api-e2e',
  preset: '../../jest.preset.js',
  moduleNameMapper: {
    '^@bcc/api$': resolve(join(__dirname, '..', 'api', 'src')),
  },
};
