import { type Knex, knex } from 'knex';

import { config } from '@/config/app.config';
import { logger } from '@/shared/logger';
import { getKnexConfig } from '@/shared/utils/knex.utils';

let instance: Knex | null = null;

export function getDatabaseConnection(): Knex {
  if (!instance) {
    instance = knex(getKnexConfig(config.nodeEnv));
    logger.info('Database Connection Pool Initialized');
  }

  return instance;
}

export async function destroyDatabaseConnection(): Promise<void> {
  if (instance) {
    await instance.destroy();
    instance = null;
    logger.info('Database connection pool destroyed');
  }
}
