/**
 * Transaction contract so use cases can run multiple repository operations
 * atomically without depending on Knex. Infrastructure implements this and
 * passes a transaction context into repository methods that support it.
 *
 * Repositories that support transactions accept an optional second argument
 * (TransactionContext) on every method that touches the DB. Use cases that
 * need atomicity inject TransactionRunner and run:
 *
 *   await this.serviceContext.withTransaction(async (tx) => {
 *     await this.userRepo.create(user, tx);
 *     await this.oauthCredentialRepo.save(cred, tx);
 *     return result;
 *   });
 *
 * Why TransactionContext instead of Knex.Transaction?
 * - Domain/application layers stay free of Knex: they depend only on this
 *   contract. Swapping the DB implementation (e.g. different driver) does not
 *   leak into use cases or repositories at the type level.
 * - The actual value at runtime is a Knex transaction (see transaction-runner.ts);
 *   the type is intentionally opaque so that only infrastructure code treats it
 *   as Knex.Transaction (e.g. RepositoryContext.getExecutor(tx)).
 */

/** Opaque type for a transaction context. Implementations use Knex.Transaction. */
export type TransactionContext = unknown;

export interface TransactionRunner {
  run<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T>;
}
