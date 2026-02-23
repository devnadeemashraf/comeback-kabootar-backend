import { getDatabaseConnection } from '@/infrastructure/db/knex';
import type {
  TransactionContext,
  TransactionRunner as ITransactionRunner,
} from '@/infrastructure/db/transaction';

export class KnexTransactionRunner implements ITransactionRunner {
  async run<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T> {
    const knex = getDatabaseConnection();
    return knex.transaction((trx) => fn(trx as TransactionContext));
  }
}
