import { knex, type Knex } from "knex";

import { config } from "@core/config";
import { getKnexConfig } from "@shared/utils/knex.utils";

let instance: Knex | null = null;

export function getDatabaseConnection(): Knex {
  if (!instance) {
    instance = knex(getKnexConfig(config.nodeEnv));
    console.log("Database Connection Pool Initialized");
  }

  return instance;
}

/** Tear down the pool (SIGTERM or test teardown). */
export async function destroyDatabaseConnection(): Promise<void> {
  if (instance) {
    await instance.destroy();
    instance = null;
    console.log("Database connection pool destroyed");
  }
}
