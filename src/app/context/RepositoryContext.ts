import type { Knex } from 'knex';
import { inject, injectable } from 'tsyringe';

import { INFRASTRUCTURE_TOKENS } from '@/app/di/tokens/infrastructure.tokens';
import type { TransactionContext } from '@/infrastructure/db/transaction';
import type { Logger } from '@/shared/logger';

/** Either the root Knex instance or a Knex transaction; both support the same query-builder API. */
export type QueryExecutor = Knex | Knex.Transaction;

/**
 * Shared context for repositories: Knex connection and logger. Atomicity is
 * achieved at the service layer (ServiceContext.withTransaction); repositories
 * only accept an optional transaction context and use it when provided.
 */
@injectable()
export class RepositoryContext {
  constructor(
    @inject(INFRASTRUCTURE_TOKENS.Knex)
    public readonly knex: Knex,

    @inject(INFRASTRUCTURE_TOKENS.Logger)
    public readonly logger: Logger,
  ) {}

  /**
   * Returns the query executor to use: the given transaction when the service
   * is running inside a transaction, otherwise the default Knex connection.
   * Repositories use this so a single code path works with or without a transaction.
   */
  getExecutor(tx: TransactionContext | undefined): QueryExecutor {
    return tx != null ? (tx as Knex.Transaction) : this.knex;
  }
}
