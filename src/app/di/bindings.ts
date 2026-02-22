import type { DependencyContainer } from 'tsyringe';

import { DI_TOKENS } from './tokens';

import { getDatabaseConnection } from '@/infrastructure/db/knex';
import { KnexTransactionRunner } from '@/infrastructure/db/transaction-runner';
import { logger } from '@/shared/logger';

/**
 * Registers all DI bindings (contracts → implementations) on the container.
 * Called from container.ts during app bootstrap.
 */
export function registerBindings(container: DependencyContainer): void {
  container.register(DI_TOKENS.Logger, { useValue: logger });
  container.register(DI_TOKENS.Knex, { useValue: getDatabaseConnection() });
  container.register(DI_TOKENS.TransactionRunner, { useClass: KnexTransactionRunner });
}
