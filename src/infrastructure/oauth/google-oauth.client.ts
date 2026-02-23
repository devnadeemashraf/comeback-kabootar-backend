import { injectable } from 'tsyringe';

import type {
  GoogleTokenApiResponse,
  GoogleTokenResponse,
  GoogleUserInfo,
  GoogleUserInfoApiResponse,
} from './google-oauth.types';

import { config } from '@/config/app';

@injectable()
class GoogleOAuthClient {
  private readonly googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  private readonly googleTokenUrl = 'https://oauth2.googleapis.com/token';
  private readonly googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
  private readonly scopes = ['email', 'profile', 'https://www.googleapis.com/auth/gmail.send'].join(
    ' ',
  );

  getAuthUrl(redirectUri: string, state: string): string {
    const { clientId } = config.oauth.google;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: this.scopes,
      state,
      access_type: 'offline',
      prompt: 'consent',
    });
    return `${this.googleAuthUrl}?${params.toString()}`;
  }

  async exchangeCodeForTokens(code: string, redirectUri: string): Promise<GoogleTokenResponse> {
    const { clientId, clientSecret } = config.oauth.google;
    const body = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const res = await fetch(this.googleTokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Token exchange failed: ${res.status} ${text}`);
    }

    const data = (await res.json()) as GoogleTokenApiResponse;
    const expiresAt = data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : null;

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? null,
      expiresAt,
    };
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const res = await fetch(this.googleUserInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Userinfo failed: ${res.status} ${text}`);
    }

    const data = (await res.json()) as GoogleUserInfoApiResponse;
    const email = data.email ?? '';
    return {
      email,
      name: data.name,
      picture: data.picture,
    };
  }
}

export { GoogleOAuthClient };
export type { GoogleTokenResponse, GoogleUserInfo } from './google-oauth.types';
