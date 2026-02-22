import type { NextFunction, Request, Response } from 'express';

import { errorResponse } from '@/shared/api/response';
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
    const body = errorResponse(err.message, err.code);
    res.status(status).json(body);
    if (status >= 500) {
      logger.error({ err: err.message, stack: err.stack, code: err.code }, 'AppError 5xx');
    }
    return;
  }

  logger.error({ err: err.message, stack: err.stack }, 'Unhandled request error');
  res.status(500).json(errorResponse('Internal Server Error'));
}
