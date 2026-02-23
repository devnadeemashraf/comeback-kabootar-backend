import type { Knex } from 'knex';
import { inject, injectable } from 'tsyringe';

import { RepositoryContext } from '../repository.context';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { OAuthCredential } from '@/entities/oauth-credential';
import { mapOAuthCredentialRowToDomain } from '@/entities/oauth-credential/oauth-credential.mapper';
import type { TransactionContext } from '@/infrastructure/db/transaction';
import type { ProviderType } from '@/shared/types/entities';

@injectable()
class OAuthCredentialRepositoryPostgres {
  constructor(
    @inject(REPOSITORY_TOKENS.RepositoryContext)
    private readonly repoCtx: RepositoryContext,
  ) {}

  async findByUserIdAndProvider(
    userId: string,
    provider: ProviderType,
    tx?: TransactionContext,
  ): Promise<OAuthCredential | null> {
    const knex = this.repoCtx.knex;
    const q = knex('oauth_credentials')
      .where('user_id', userId)
      .where('provider', provider)
      .first();
    const row = tx ? await q.transacting(tx as Knex.Transaction) : await q;
    return row ? mapOAuthCredentialRowToDomain(row) : null;
  }

  async save(
    data: {
      userId: string;
      provider: ProviderType;
      connectedEmail: string;
      accessToken: string | null;
      refreshToken: string | null;
      expiresAt: Date | null;
    },
    tx?: TransactionContext,
  ): Promise<OAuthCredential> {
    const knex = this.repoCtx.knex;
    const rowData = {
      user_id: data.userId,
      provider: data.provider,
      connected_email: data.connectedEmail,
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
      expires_at: data.expiresAt,
    };
    const [row] = await (tx
      ? knex('oauth_credentials')
          .insert(rowData)
          .returning('*')
          .transacting(tx as Knex.Transaction)
      : knex('oauth_credentials').insert(rowData).returning('*'));
    return mapOAuthCredentialRowToDomain(row);
  }

  async updateTokens(
    id: string,
    accessToken: string | null,
    refreshToken: string | null,
    expiresAt: Date | null,
    tx?: TransactionContext,
  ): Promise<void> {
    const knex = this.repoCtx.knex;
    const q = knex('oauth_credentials').where('id', id).update({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      updated_at: knex.fn.now(),
    });
    if (tx) await q.transacting(tx as Knex.Transaction);
    else await q;
  }
}

export { OAuthCredentialRepositoryPostgres };
