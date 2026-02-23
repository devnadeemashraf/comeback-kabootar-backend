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

  // Auth (JWT + cookie)
  JWT_SECRET: z.string().min(1).optional(), // required in non-test
  JWT_EXPIRY: z.string().default('7d'),
  JWT_ISSUER: z.string().min(1).optional(),
  JWT_AUDIENCE: z.string().min(1).optional(),
  AUTH_COOKIE_NAME: z.string().default('ck_session'),
  FRONTEND_URL: z.url().default('http://localhost:5173'),
  BACKEND_URL: z.url().default('http://localhost:3000'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().default(''),
  GOOGLE_CLIENT_SECRET: z.string().default(''),

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

  // MinIO (S3-compatible) for template attachments
  MINIO_ENDPOINT: z.url().optional(),
  MINIO_BUCKET: z.string().min(1).default('templates'),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin123'),
  MINIO_USE_SSL: z.coerce.boolean().default(false),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // Logger not available yet (config is loaded before logger); use console for bootstrap errors.
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration:', z.treeifyError(parsed.error));
  process.exit(1);
}

// JWT_SECRET required in non-test environments
const validatedEnv = parsed.data;
if (
  validatedEnv.NODE_ENV !== 'testing' &&
  (!validatedEnv.JWT_SECRET || validatedEnv.JWT_SECRET.length === 0)
) {
  // eslint-disable-next-line no-console
  console.error('JWT_SECRET is required when NODE_ENV is not "testing".');
  process.exit(1);
}

/** Validated environment (raw parsed values) and app config. */
export const env = validatedEnv;

export const config = {
  isDev: validatedEnv.NODE_ENV === 'development',
  isProd: validatedEnv.NODE_ENV === 'production',
  isTest: validatedEnv.NODE_ENV === 'testing',
  port: validatedEnv.PORT,
  nodeEnv: validatedEnv.NODE_ENV,

  auth: {
    jwtSecret: validatedEnv.JWT_SECRET ?? '',
    jwtExpiry: validatedEnv.JWT_EXPIRY,
    jwtIssuer: validatedEnv.JWT_ISSUER,
    jwtAudience: validatedEnv.JWT_AUDIENCE,
    cookieName: validatedEnv.AUTH_COOKIE_NAME,
    frontendUrl: validatedEnv.FRONTEND_URL,
    backendUrl: validatedEnv.BACKEND_URL,
  },

  oauth: {
    google: {
      clientId: validatedEnv.GOOGLE_CLIENT_ID,
      clientSecret: validatedEnv.GOOGLE_CLIENT_SECRET,
      redirectUri: `${validatedEnv.BACKEND_URL.replace(/\/$/, '')}/api/v1/auth/google/callback`,
    },
  },

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

  minio: {
    endpoint: validatedEnv.MINIO_ENDPOINT ?? 'http://localhost:9000',
    bucket: validatedEnv.MINIO_BUCKET,
    accessKey: validatedEnv.MINIO_ACCESS_KEY,
    secretKey: validatedEnv.MINIO_SECRET_KEY,
    useSSL: validatedEnv.MINIO_USE_SSL,
  },
} as const;
export type AppConfig = typeof config;
