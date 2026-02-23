import { DependencyContainer } from 'tsyringe';

import { INFRASTRUCTURE_TOKENS } from '../tokens/infrastructure.tokens';

import { getDatabaseConnection } from '@/infrastructure/db/knex';
import { KnexTransactionRunner } from '@/infrastructure/db/transaction-runner';
import { GoogleOAuthClient } from '@/infrastructure/oauth/google-oauth.client';
import { logger } from '@/shared/logger';

export function registerInfrastructureBindings(container: DependencyContainer): void {
  container.register(INFRASTRUCTURE_TOKENS.Logger, { useValue: logger });
  container.register(INFRASTRUCTURE_TOKENS.Knex, { useValue: getDatabaseConnection() });
  container.register(INFRASTRUCTURE_TOKENS.TransactionRunner, { useClass: KnexTransactionRunner });
  container.registerSingleton(INFRASTRUCTURE_TOKENS.GoogleOAuthClient, GoogleOAuthClient);
}
