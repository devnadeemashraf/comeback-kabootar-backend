/**
 * Transaction contract so use cases can run multiple repository operations
 * atomically without depending on Knex. Infrastructure implements this and
 * passes a transaction context into repository methods that support it.
 *
 * Repositories that support transactions accept an optional second argument
 * (TransactionContext) on every method that touches the DB. Use cases that
 * need atomicity inject TransactionRunner and run:
 *
 *   await this.transactionRunner.run(async (tx) => {
 *     await this.userRepo.create(user, tx);
 *     await this.oauthCredentialRepo.save(cred, tx);
 *     return result;
 *   });
 */

/** Opaque type for a transaction context. Implementations use Knex.Transaction. */
export type TransactionContext = unknown;

export interface TransactionRunner {
  run<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T>;
}
