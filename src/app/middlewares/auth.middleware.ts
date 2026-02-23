import type { NextFunction, Request, Response } from 'express';

import { config } from '@/config/app';
import { unauthorized } from '@/shared/api/response';
import { verifyJwt } from '@/shared/jwt';
import { logger } from '@/shared/logger';
import type { RequestUser } from '@/shared/types/express';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.cookies?.[config.auth.cookieName];
    if (!token) {
      unauthorized(res, 'Unauthorized', 'MISSING_TOKEN');
      return;
    }

    const payload = await verifyJwt(token, config.auth.jwtSecret);
    const user: RequestUser = {
      id: payload.sub,
      ...(payload.email !== undefined && { email: payload.email }),
    };

    req.user = user;
    next();
  } catch (error) {
    logger.error(error, 'Failed To Verify Auth State Of User');
    unauthorized(res, 'Unauthorized', 'INVALID_TOKEN');
  }
}
