import path from 'node:path';

import type { Knex } from 'knex';

import { config } from '@/config/app.config';
import { logger } from '@/shared/logger';
import type { NodeEnv } from '@/shared/types/config';

function getKnexConnectionConfig(env: NodeEnv = 'development'): Knex.PgConnectionConfig {
  const { user, password, host, port, sslMode } = config.database.pg;
  let { db } = config.database.pg;

  if (env === 'testing') {
    db = db + '_test';
  }

  const connectionString =
    `postgres://${user}:${password}@${host}:${port}/${db}?sslmode=${sslMode}` as const;

  const base: Knex.PgConnectionConfig = {
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  return base;
}

function getKnexPoolConfig(env: NodeEnv = 'development'): Knex.PoolConfig {
  let { min, max } = config.database.pool;

  if (env === 'production') {
    min = Math.max(min, 2);
    max = Math.max(max, 20);
  }

  const base: Knex.PoolConfig = {
    min,
    max,
    afterCreate: (conn: unknown, done: (err: Error | null, conn: unknown) => void) => {
      if (config.isDev) logger.debug('New database connection established');
      done(null, conn);
    },
  };
  return base;
}

function getKnexMigratorConfig(): Knex.MigratorConfig {
  const base: Knex.MigratorConfig = {
    directory: path.join(process.cwd(), 'src/migrations'),
    extension: 'ts',
  };
  return base;
}

export function getKnexConfig(env: NodeEnv = 'development'): Knex.Config {
  const base: Knex.Config = {
    client: 'pg',
    connection: getKnexConnectionConfig(env),
    pool: getKnexPoolConfig(env),
    migrations: getKnexMigratorConfig(),
    acquireConnectionTimeout: 10_000,
  };
  return base;
}
