import { inject, injectable } from 'tsyringe';

import { RepositoryContext } from '@/app/context/RepositoryContext';
import { CONTEXT_TOKENS } from '@/app/di/tokens/context.tokens';
import type { User } from '@/entities/user';
import { mapUserRowToDomain } from '@/entities/user/user.mapper';
import type { TransactionContext } from '@/infrastructure/db/transaction';

@injectable()
class UserRepositoryPostgres {
  private readonly _name = 'UserRepositoryPostgres';

  constructor(
    @inject(CONTEXT_TOKENS.RepositoryContext)
    private readonly repoCtx: RepositoryContext,
  ) {}

  async findByEmail(email: string, tx?: TransactionContext): Promise<User | null> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'findByEmail', email },
      'repository execution',
    );
    const row = await db('users').where('email', email).whereNull('deleted_at').first();
    const result = row ? mapUserRowToDomain(row) : null;
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'findByEmail', found: !!result },
      'repository completed',
    );
    return result;
  }

  async findById(id: string, tx?: TransactionContext): Promise<User | null> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'findById', id },
      'repository execution',
    );
    const row = await db('users').where('id', id).whereNull('deleted_at').first();
    const result = row ? mapUserRowToDomain(row) : null;
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'findById', found: !!result },
      'repository completed',
    );
    return result;
  }

  async create(data: { email: string }, tx?: TransactionContext): Promise<User> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'create', email: data.email },
      'repository execution',
    );
    const [row] = await db('users').insert({ email: data.email }).returning('*');
    if (!row) throw new Error('User create returned no row');
    const result = mapUserRowToDomain(row);
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'create', userId: result.id },
      'repository completed',
    );
    return result;
  }
}

export { UserRepositoryPostgres };
