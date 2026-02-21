import type { NextFunction, Request, Response } from 'express';

import { logger } from '@/shared/logger';

/**
 * Central error handler. Catches errors, logs them, and returns a consistent JSON response.
 * Must be registered after routes (as the last middleware).
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error({ err: err.message, stack: err.stack }, 'Unhandled request error');

  const status = (err as { status?: number }).status ?? 500;
  const message = (err as { expose?: boolean }).expose ? err.message : 'Internal Server Error';

  res.status(status).json({ error: message });
}
