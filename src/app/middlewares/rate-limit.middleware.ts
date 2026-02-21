import type { NextFunction, Request, Response } from 'express';

/**
 * Rate-limit middleware placeholder. Will use Redis or in-memory store when implemented.
 * For now, no-op; replace with express-rate-limit or BullMQ-backed limiter later.
 */
export function rateLimitMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  next();
}
