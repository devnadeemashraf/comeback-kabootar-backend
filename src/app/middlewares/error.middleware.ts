import type { NextFunction, Request, Response } from 'express';

import { errorWithStatus, internalError } from '@/shared/api/response';
import { AppError } from '@/shared/errors';
import { logger } from '@/shared/logger';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    const status = err.status ?? 500;
    if (status >= 500) {
      logger.error({ err: err.message, stack: err.stack, code: err.code }, 'AppError 5xx');
    }
    errorWithStatus(res, status, err.message, err.code);
    return;
  }

  logger.error({ err: err.message, stack: err.stack }, 'Unhandled request error');
  internalError(res);
}
