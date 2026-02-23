import type { Knex } from 'knex';
import { inject, injectable } from 'tsyringe';

import { RepositoryContext } from '../repository.context';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { User } from '@/entities/user';
import { mapUserRowToDomain } from '@/entities/user/user.mapper';
import type { TransactionContext } from '@/infrastructure/db/transaction';

@injectable()
class UserRepositoryPostgres {
  constructor(
    @inject(REPOSITORY_TOKENS.RepositoryContext)
    private readonly repoCtx: RepositoryContext,
  ) {}

  async findByEmail(email: string, tx?: TransactionContext): Promise<User | null> {
    const knex = this.repoCtx.knex;
    const q = knex('users').where('email', email).whereNull('deleted_at').first();
    const row = tx ? await q.transacting(tx as Knex.Transaction) : await q;
    return row ? mapUserRowToDomain(row) : null;
  }

  async findById(id: string, tx?: TransactionContext): Promise<User | null> {
    const knex = this.repoCtx.knex;
    const q = knex('users').where('id', id).whereNull('deleted_at').first();
    const row = tx ? await q.transacting(tx as Knex.Transaction) : await q;
    return row ? mapUserRowToDomain(row) : null;
  }

  async create(data: { email: string }, tx?: TransactionContext): Promise<User> {
    const knex = this.repoCtx.knex;
    const [row] = await (tx
      ? knex('users')
          .insert({ email: data.email })
          .returning('*')
          .transacting(tx as Knex.Transaction)
      : knex('users').insert({ email: data.email }).returning('*'));
    return mapUserRowToDomain(row);
  }
}

export { UserRepositoryPostgres };
