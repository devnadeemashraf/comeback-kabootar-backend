import { config } from '@/config/app';

/** Options for auth-related cookies (state, JWT); used by Express res.cookie(). */
export interface AuthCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  maxAge: number;
  path: '/';
}

/** Builds cookie options for auth cookies (state or session). Single place for auth cookie shape. */
export function buildAuthCookieOptions(maxAgeMs: number): AuthCookieOptions {
  return {
    httpOnly: true,
    secure: config.isProd,
    sameSite: 'lax',
    maxAge: maxAgeMs,
    path: '/',
  };
}

/** Cookie name for OAuth state (CSRF). */
export const STATE_COOKIE_NAME = 'ck_oauth_state';

/** Max age for state cookie (short-lived). */
export const STATE_COOKIE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

/** Max age for JWT session cookie. */
export const JWT_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
