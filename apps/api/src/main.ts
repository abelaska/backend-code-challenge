import 'source-map-support/register';

import { fastifyBootstrap } from '@bcc/fastify-bootstrap';

import { onSetup } from './setup';

fastifyBootstrap({ onSetup });
