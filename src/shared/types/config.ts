import { z } from 'zod/v4';

export const NODE_ENV = ['development', 'production', 'testing'] as const;
export const NodeEnvSchema = z.enum(NODE_ENV);
export type NodeEnv = z.infer<typeof NodeEnvSchema>;

export const LOG_LEVEL = ['fatal', 'error', 'warn', 'info', 'debug', 'trace'] as const;
export const LogLevelSchema = z.enum(LOG_LEVEL);
export type LogLevel = z.infer<typeof LogLevelSchema>;

export const POSTGRES_SSL_MODE = [
  'disable',
  'allow',
  'prefer',
  'require',
  'verify-ca',
  'verify-full',
] as const;
export const PostgresSSLModeSchema = z.enum(POSTGRES_SSL_MODE);
export type PostgresSSLMode = z.infer<typeof PostgresSSLModeSchema>;
