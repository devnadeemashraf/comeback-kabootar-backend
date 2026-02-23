import * as jose from 'jose';

import { config } from '@/config/app';
import type { UserJwtPayload, VerifiedJwtPayload } from '@/shared/types/jwt';

/** HMAC-SHA256. Always allowlist this in verify to reject alg:none or other algorithms. */
const ALGORITHM = 'HS256';

export async function signJwt(
  payload: UserJwtPayload,
  secret: string,
  expiry: string,
): Promise<string> {
  const key = new TextEncoder().encode(secret);
  const customClaims = { ...(payload.email !== undefined && { email: payload.email }) };
  let jwt = new jose.SignJWT(customClaims)
    .setProtectedHeader({ alg: ALGORITHM })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiry);

  if (config.auth.jwtIssuer) jwt = jwt.setIssuer(config.auth.jwtIssuer);
  if (config.auth.jwtAudience) jwt = jwt.setAudience(config.auth.jwtAudience);

  return jwt.sign(key);
}

export async function verifyJwt(token: string, secret: string): Promise<VerifiedJwtPayload> {
  const key = new TextEncoder().encode(secret);
  const verifyOptions = {
    algorithms: [ALGORITHM],
    ...(config.auth.jwtIssuer && { issuer: config.auth.jwtIssuer }),
    ...(config.auth.jwtAudience && { audience: config.auth.jwtAudience }),
  };

  const { payload } = await jose.jwtVerify(token, key, verifyOptions);

  const sub = payload.sub;
  if (typeof sub !== 'string') {
    throw new Error('Invalid JWT payload: missing or invalid sub');
  }
  const email = payload.email;
  if (email !== undefined && typeof email !== 'string') {
    throw new Error('Invalid JWT payload: email must be a string when present');
  }

  return { sub, ...(email !== undefined && { email }) };
}
