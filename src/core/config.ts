import "dotenv/config";

import { z } from "zod/v4";

import { NODE_ENV, LOG_LEVEL, POSTGRES_SSL_MODE } from "@shared/types/config";

const envSchema = z.object({
  // App
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(NODE_ENV).default("development"),
  LOG_LEVEL: z.enum(LOG_LEVEL).default("debug"),

  // Clustering
  WEB_CONCURRENCY: z.coerce.number().default(0),

  // Database
  POSTGRES_HOST: z.string().min(1).default("localhost"),
  POSTGRES_PORT: z.coerce.number().default(5432),
  POSTGRES_USER: z.string().min(1).default("admin"),
  POSTGRES_PASSWORD: z.string().min(1).default("your_password_here"),
  POSTGRES_DATABASE: z.string().min(1).default("comeback_kabootar_primary"),
  POSTGRES_SSL_MODE: z.enum(POSTGRES_SSL_MODE).default("prefer"),
  // Connection Pooling
  DATABASE_POOL_MIN: z.coerce.number().default(2),
  DATABASE_POOL_MAX: z.coerce.number().default(10),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    "Invalid environment configuration: ",
    z.treeifyError(parsed.error)
  );
  process.exit(1);
}

const env = parsed.data;

export const config = {
  isDev: env.NODE_ENV === "development",
  isProd: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "testing",
  port: env.PORT,
  nodeEnv: env.NODE_ENV,

  database: {
    pg: {
      host: env.POSTGRES_HOST,
      port: env.POSTGRES_PORT,
      user: env.POSTGRES_USER,
      password: env.POSTGRES_PASSWORD,
      db: env.POSTGRES_DATABASE,
      sslMode: env.POSTGRES_SSL_MODE,
    },
    pool: {
      min: env.DATABASE_POOL_MIN,
      max: env.DATABASE_POOL_MAX,
    },
  },

  cluster: {
    workers: env.WEB_CONCURRENCY,
  },

  log: {
    level: env.LOG_LEVEL,
  },
} as const;
export type AppConfig = typeof config;
