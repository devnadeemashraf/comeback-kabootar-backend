/** Payload used when signing a JWT; sub = user id, maps to req.user after verification. */
export interface UserJwtPayload {
  sub: string;
  email?: string;
  iss?: string;
  aud?: string;
}

/** Payload returned from verifyJwt; sub always present, email if present in token. */
export interface VerifiedJwtPayload {
  sub: string;
  email?: string;
}
