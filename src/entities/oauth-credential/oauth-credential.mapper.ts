import type { OAuthCredential, OAuthCredentialRow } from './oauth-credential.entity';

export function mapOAuthCredentialRowToDomain(row: OAuthCredentialRow): OAuthCredential {
  return {
    id: row.id,
    userId: row.user_id,
    provider: row.provider,
    connectedEmail: row.connected_email,
    accessToken: row.access_token,
    refreshToken: row.refresh_token,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapOAuthCredentialDomainToRow(domain: OAuthCredential): OAuthCredentialRow {
  return {
    id: domain.id,
    user_id: domain.userId,
    provider: domain.provider,
    connected_email: domain.connectedEmail,
    access_token: domain.accessToken,
    refresh_token: domain.refreshToken,
    expires_at: domain.expiresAt,
    created_at: domain.createdAt,
    updated_at: domain.updatedAt,
  };
}
