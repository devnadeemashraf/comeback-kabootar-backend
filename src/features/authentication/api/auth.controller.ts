import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { GetCurrentUserService } from '../service/get-current-user.service';
import { HandleGoogleAuthenticationCallbackService } from '../service/handle-google-callback.service';
import { InitiateGoogleAuthenticationService } from '../service/initiate-google-auth.service';
import {
  buildAuthCookieOptions,
  JWT_COOKIE_MAX_AGE_MS,
  STATE_COOKIE_MAX_AGE_MS,
  STATE_COOKIE_NAME,
} from '../utils/cookie.utils';
import { callbackQuerySchema } from '../validators/callback.schema';

import { SERVICE_TOKENS } from '@/app/di/tokens/service.tokens';
import { config } from '@/config/app';
import { noContent, ok, validationError } from '@/shared/api/response';

@injectable()
export class OAuthController {
  constructor(
    @inject(SERVICE_TOKENS.InitiateGoogleAuthenticationService)
    private readonly initiateGoogleAuthService: InitiateGoogleAuthenticationService,
    @inject(SERVICE_TOKENS.HandleGoogleAuthenticationCallbackService)
    private readonly handleGoogleCallbackService: HandleGoogleAuthenticationCallbackService,
    @inject(SERVICE_TOKENS.GetCurrentUserService)
    private readonly getCurrentUserService: GetCurrentUserService,
  ) {}

  initiateGoogleAuth(_req: Request, res: Response): void {
    const { url, state } = this.initiateGoogleAuthService.execute();
    res.cookie(STATE_COOKIE_NAME, state, buildAuthCookieOptions(STATE_COOKIE_MAX_AGE_MS));
    res.redirect(302, url);
  }

  async handleGoogleCallback(req: Request, res: Response): Promise<void> {
    const parsed = callbackQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      validationError(res, 'Invalid callback parameters', 'INVALID_CALLBACK');
      return;
    }

    const { code, state } = parsed.data;
    const stateFromCookie = req.cookies?.[STATE_COOKIE_NAME] ?? null;

    const result = await this.handleGoogleCallbackService.execute({
      code,
      state,
      stateFromCookie,
    });

    res.clearCookie(STATE_COOKIE_NAME, { path: '/' });
    res.cookie(config.auth.cookieName, result.jwt, buildAuthCookieOptions(JWT_COOKIE_MAX_AGE_MS));
    res.redirect(302, config.auth.frontendUrl);
  }

  me(req: Request, res: Response): void {
    const user = req.user!;
    const dto = this.getCurrentUserService.execute(user);
    ok(res, dto);
  }

  logout(_req: Request, res: Response): void {
    res.clearCookie(config.auth.cookieName, { path: '/' });
    noContent(res);
  }
}
