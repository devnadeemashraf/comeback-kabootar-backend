import 'dotenv/config';

import { z } from 'zod/v4';

import { LOG_LEVEL, NODE_ENV, POSTGRES_SSL_MODE } from '@/shared/types/config';

const envSchema = z.object({
  // App
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(NODE_ENV).default('development'),
  LOG_LEVEL: z.enum(LOG_LEVEL).default('debug'),

  // Clustering
  WEB_CONCURRENCY: z.coerce.number().default(0),

  // Database
  POSTGRES_HOST: z.string().min(1).default('localhost'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string().min(1).default('admin'),
  POSTGRES_PASSWORD: z.string().min(1).default('your_password_here'),
  POSTGRES_DATABASE: z.string().min(1).default('comeback_kabootar_primary'),
  POSTGRES_SSL_MODE: z.enum(POSTGRES_SSL_MODE).default('prefer'),
  // Connection Pooling
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // Logger not available yet (config is loaded before logger); use console for bootstrap errors.
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration:', z.treeifyError(parsed.error));
  process.exit(1);
}

const validatedEnv = parsed.data;

/** Validated environment (raw parsed values). Re-exported by env.ts. */
export const env = validatedEnv;

export const config = {
  isDev: validatedEnv.NODE_ENV === 'development',
  isProd: validatedEnv.NODE_ENV === 'production',
  isTest: validatedEnv.NODE_ENV === 'testing',
  port: validatedEnv.PORT,
  nodeEnv: validatedEnv.NODE_ENV,

  database: {
    pg: {
      host: validatedEnv.POSTGRES_HOST,
      port: validatedEnv.POSTGRES_PORT,
      user: validatedEnv.POSTGRES_USER,
      password: validatedEnv.POSTGRES_PASSWORD,
      db: validatedEnv.POSTGRES_DATABASE,
      sslMode: validatedEnv.POSTGRES_SSL_MODE,
    },
    pool: {
      min: validatedEnv.DATABASE_POOL_MIN,
      max: validatedEnv.DATABASE_POOL_MAX,
    },
  },

  cluster: {
    workers: validatedEnv.WEB_CONCURRENCY,
  },

  log: {
    level: validatedEnv.LOG_LEVEL,
  },
} as const;
export type AppConfig = typeof config;
