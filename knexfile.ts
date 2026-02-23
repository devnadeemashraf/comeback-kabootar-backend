import type { Knex } from 'knex';

import { getKnexConfig } from './src/shared/utils/knex';

const envs = ['development', 'production'] as const;
const knexConfig: Record<string, Knex.Config> = Object.fromEntries(
  envs.map((e) => [e, getKnexConfig(e)]),
);

export default knexConfig;
