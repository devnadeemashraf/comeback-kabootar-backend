import type { NextFunction, Request, Response } from 'express';

/**
 * Auth middleware placeholder. Will validate JWT / OAuth context when implemented.
 * For now, no-op; attach to protected routes when auth is ready.
 */
export function authMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
