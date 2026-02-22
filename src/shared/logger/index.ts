import pino, {
  type TransportMultiOptions,
  type TransportPipelineOptions,
  type TransportSingleOptions,
} from 'pino';

import { config } from '@/config/app';

type LoggerTransport = TransportSingleOptions | TransportMultiOptions | TransportPipelineOptions;

/**
 * Dev-only: pretty transport runs in a worker so the main thread stays fast.
 * Production: no transport (JSON to stdout for log aggregators); metrics transport can be added later.
 */
function getLoggerTransport(): LoggerTransport | undefined {
  if (!config.isDev) return undefined;

  return {
    target: 'pino-pretty',
    options: {
      colorize: true,
      colorizeObjects: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      levelFirst: true,
      messageFormat: '{msg}',
      singleLine: false,
      errorLikeObjectKeys: ['err', 'error'],
    },
  };
}

export type Logger = pino.Logger;
export const logger = pino({
  level: config.log.level,
  transport: getLoggerTransport(),
});
