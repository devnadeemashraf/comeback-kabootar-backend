import type { Knex } from "knex";

import { getKnexConfig } from "./src/shared/utils/knex.utils";

const knexConfig: Record<string, Knex.Config> = {
  development: getKnexConfig("development"),
  production: getKnexConfig("production"),
};

export default knexConfig;
