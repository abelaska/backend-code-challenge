import type { PinoLoggerOptions } from 'fastify/types/logger';

export function createLoggerOptions(): boolean | PinoLoggerOptions {
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return {
    messageKey: 'message', // value optimized for Newrelic
    timestamp: () => `,"timestamp": "${Date.now()}"`, // value optimized for Newrelic
    transport: {
      targets: [
        {
          level: 'info',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            messageKey: 'message',
            singleLine: true,
            timestampKey: 'timestamp',
            translateTime: true,
          },
          target: 'pino-pretty',
        },
      ],
    },
  };
}
