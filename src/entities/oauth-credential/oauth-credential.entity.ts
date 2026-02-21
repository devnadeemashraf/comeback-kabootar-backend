import type { ProviderType } from '@/shared/types/entities';

export interface OAuthCredential {
  id: string;
  userId: string;
  provider: ProviderType;
  connectedEmail: string;
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OAuthCredentialRow {
  id: string;
  user_id: string;
  provider: ProviderType;
  connected_email: string;
  access_token: string | null;
  refresh_token: string | null;
  expires_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
