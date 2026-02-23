/**
 * Google OAuth types: raw API responses (snake_case) and domain shapes (camelCase).
 * @see https://developers.google.com/identity/protocols/oauth2/web-server#handlingresponse
 * @see https://developers.google.com/identity/protocols/oauth2/openid-connect#obtainuserinfo
 */

/** Raw JSON shape returned by Google token endpoint. */
export interface GoogleTokenApiResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

/** Raw JSON shape returned by Google userinfo endpoint. */
export interface GoogleUserInfoApiResponse {
  id?: string;
  email?: string;
  verified_email?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
  hd?: string;
}

/** Domain shape for tokens after mapping from GoogleTokenApiResponse. */
export interface GoogleTokenResponse {
  accessToken: string;
  refreshToken: string | null;
  expiresAt: Date | null;
}

/** Domain shape for user info after mapping from GoogleUserInfoApiResponse; email required after validation. */
export interface GoogleUserInfo {
  email: string;
  name?: string;
  picture?: string;
}
