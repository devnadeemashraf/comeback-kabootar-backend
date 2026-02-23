import { inject, injectable } from 'tsyringe';

import type { ServiceContext } from '@/app/context/ServiceContext';
import { CONTEXT_TOKENS } from '@/app/di/tokens/context.tokens';
import { INFRASTRUCTURE_TOKENS } from '@/app/di/tokens/infrastructure.tokens';
import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { config } from '@/config/app';
import type { UserDto } from '@/entities/user';
import { toUserDto } from '@/entities/user';
import type { OAuthCredentialRepositoryPostgres } from '@/infrastructure/db/repositories/pg/oauth-credential.repo.pg';
import type { UserRepositoryPostgres } from '@/infrastructure/db/repositories/pg/user.repo.pg';
import type { GoogleOAuthClient } from '@/infrastructure/oauth/google-oauth.client';
import { UnauthorizedError, ValidationError } from '@/shared/errors';
import { signJwt } from '@/shared/jwt';
import type { ProviderType } from '@/shared/types/entities';

const GOOGLE_PROVIDER: ProviderType = 'GOOGLE';

/** Input for HandleGoogleAuthenticationCallbackService.execute. */
export interface HandleGoogleCallbackInput {
  code: string;
  state: string;
  stateFromCookie: string | null;
}

/** Result of HandleGoogleAuthenticationCallbackService.execute. */
export interface HandleGoogleCallbackResult {
  jwt: string;
  user: UserDto;
}

@injectable()
export class HandleGoogleAuthenticationCallbackService {
  constructor(
    @inject(CONTEXT_TOKENS.ServiceContext)
    private readonly serviceContext: ServiceContext,
    @inject(INFRASTRUCTURE_TOKENS.GoogleOAuthClient)
    private readonly googleOAuthClient: GoogleOAuthClient,
    @inject(REPOSITORY_TOKENS.UserRepositoryPostgres)
    private readonly userRepo: UserRepositoryPostgres,
    @inject(REPOSITORY_TOKENS.OAuthCredentialRepositoryPostgres)
    private readonly oauthCredentialRepo: OAuthCredentialRepositoryPostgres,
  ) {}

  async execute(input: HandleGoogleCallbackInput): Promise<HandleGoogleCallbackResult> {
    const { code, state, stateFromCookie } = input;

    if (!stateFromCookie || state !== stateFromCookie) {
      throw new UnauthorizedError('Invalid or missing OAuth state', 'INVALID_STATE');
    }

    const redirectUri = config.oauth.google.redirectUri;

    let tokens;
    try {
      tokens = await this.googleOAuthClient.exchangeCodeForTokens(code, redirectUri);
    } catch {
      throw new UnauthorizedError('Failed to exchange code for tokens', 'TOKEN_EXCHANGE_FAILED');
    }

    let userInfo;
    try {
      userInfo = await this.googleOAuthClient.getUserInfo(tokens.accessToken);
    } catch {
      throw new UnauthorizedError('Failed to fetch user info', 'USERINFO_FAILED');
    }

    const email = userInfo.email;
    if (!email) {
      throw new ValidationError('Email not provided by provider', 'MISSING_EMAIL');
    }

    const user = await this.serviceContext.withTransaction(async (tx) => {
      let u = await this.userRepo.findByEmail(email, tx);
      if (!u) {
        u = await this.userRepo.create({ email }, tx);
      }

      const existing = await this.oauthCredentialRepo.findByUserIdAndProvider(
        u.id,
        GOOGLE_PROVIDER,
        tx,
      );

      if (existing) {
        await this.oauthCredentialRepo.updateTokens(
          existing.id,
          tokens.accessToken,
          tokens.refreshToken,
          tokens.expiresAt,
          tx,
        );
      } else {
        await this.oauthCredentialRepo.save(
          {
            userId: u.id,
            provider: GOOGLE_PROVIDER,
            connectedEmail: email,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.expiresAt,
          },
          tx,
        );
      }

      return u;
    });

    const jwt = await signJwt(
      { sub: user.id, email: user.email as string },
      config.auth.jwtSecret,
      config.auth.jwtExpiry,
    );

    return {
      jwt,
      user: toUserDto(user),
    };
  }
}
