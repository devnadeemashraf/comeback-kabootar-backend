import { randomBytes } from 'node:crypto';

import { inject, injectable } from 'tsyringe';

import { INFRASTRUCTURE_TOKENS } from '@/app/di/tokens/infrastructure.tokens';
import { config } from '@/config/app';
import type { GoogleOAuthClient } from '@/infrastructure/oauth/google-oauth.client';

/** Result of InitiateGoogleAuthenticationService.execute. */
export interface InitiateGoogleAuthResult {
  url: string;
  state: string;
}

@injectable()
export class InitiateGoogleAuthenticationService {
  constructor(
    @inject(INFRASTRUCTURE_TOKENS.GoogleOAuthClient)
    private readonly googleOAuthClient: GoogleOAuthClient,
  ) {}

  execute(): InitiateGoogleAuthResult {
    const state = randomBytes(32).toString('hex');
    const redirectUri = config.oauth.google.redirectUri;
    const url = this.googleOAuthClient.getAuthUrl(redirectUri, state);
    return { url, state };
  }
}
