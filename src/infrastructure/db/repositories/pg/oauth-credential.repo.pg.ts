import { inject, injectable } from 'tsyringe';

import { RepositoryContext } from '@/app/context/RepositoryContext';
import { CONTEXT_TOKENS } from '@/app/di/tokens/context.tokens';
import type { OAuthCredential } from '@/entities/oauth-credential';
import { mapOAuthCredentialRowToDomain } from '@/entities/oauth-credential/oauth-credential.mapper';
import type { TransactionContext } from '@/infrastructure/db/transaction';
import type { ProviderType } from '@/shared/types/entities';

@injectable()
class OAuthCredentialRepositoryPostgres {
  private readonly _name = 'OAuthCredentialRepositoryPostgres';

  constructor(
    @inject(CONTEXT_TOKENS.RepositoryContext)
    private readonly repoCtx: RepositoryContext,
  ) {}

  async findByUserIdAndProvider(
    userId: string,
    provider: ProviderType,
    tx?: TransactionContext,
  ): Promise<OAuthCredential | null> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'findByUserIdAndProvider', userId, provider },
      'repository execution',
    );
    const row = await db('oauth_credentials')
      .where('user_id', userId)
      .where('provider', provider)
      .first();
    const result = row ? mapOAuthCredentialRowToDomain(row) : null;
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'findByUserIdAndProvider', found: !!result },
      'repository completed',
    );
    return result;
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
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'save', userId: data.userId, provider: data.provider },
      'repository execution',
    );
    const rowData = {
      user_id: data.userId,
      provider: data.provider,
      connected_email: data.connectedEmail,
      access_token: data.accessToken,
      refresh_token: data.refreshToken,
      expires_at: data.expiresAt,
    };
    const [row] = await db('oauth_credentials').insert(rowData).returning('*');
    if (!row) throw new Error('OAuth credential save returned no row');
    const result = mapOAuthCredentialRowToDomain(row);
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'save', credentialId: result.id },
      'repository completed',
    );
    return result;
  }

  async updateTokens(
    id: string,
    accessToken: string | null,
    refreshToken: string | null,
    expiresAt: Date | null,
    tx?: TransactionContext,
  ): Promise<void> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'updateTokens', id },
      'repository execution',
    );
    await db('oauth_credentials').where('id', id).update({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_at: expiresAt,
      updated_at: this.repoCtx.knex.fn.now(),
    });
    this.repoCtx.logger.debug(
      { repository: this._name, method: 'updateTokens' },
      'repository completed',
    );
  }
}

export { OAuthCredentialRepositoryPostgres };
