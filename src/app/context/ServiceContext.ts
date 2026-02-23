import { inject, injectable } from 'tsyringe';

import { INFRASTRUCTURE_TOKENS } from '@/app/di/tokens/infrastructure.tokens';
import type { TransactionContext, TransactionRunner } from '@/infrastructure/db/transaction';
import type { Logger } from '@/shared/logger';

/**
 * Shared context for the service/use-case layer. Provides a single place for
 * cross-cutting concerns: logging and transactional atomicity. Services
 * inject ServiceContext and use it for traceability and for running
 * multi-repository operations in a single transaction.
 */
@injectable()
export class ServiceContext {
  constructor(
    @inject(INFRASTRUCTURE_TOKENS.Logger)
    public readonly logger: Logger,

    @inject(INFRASTRUCTURE_TOKENS.TransactionRunner)
    private readonly transactionRunner: TransactionRunner,
  ) {}

  /**
   * Runs the given callback inside a database transaction. All repository
   * calls that receive the passed `tx` participate in the same transaction;
   * on success the transaction is committed, on throw it is rolled back.
   *
   * Use this when a use case must perform multiple repository operations
   * atomically. Pass `tx` into every repository method that supports it.
   *
   * Errors are logged for traceability and then rethrown so the caller (or
   * global error middleware) can handle them; the transaction is rolled back
   * automatically by the underlying runner.
   *
   * @param fn - Callback that receives the transaction context to pass to repos
   * @returns The value returned by fn
   * @throws Rethrows any error from fn after logging
   */
  async withTransaction<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T> {
    try {
      return await this.transactionRunner.run(fn);
    } catch (err) {
      this.logger.error(
        { err, context: 'ServiceContext.withTransaction' },
        'Transaction failed; changes have been rolled back.',
      );
      throw err;
    }
  }
}
