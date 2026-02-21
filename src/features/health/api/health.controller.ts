import type { Request, Response } from 'express';

import { getHealth } from '../service/get-health.usecase';

/**
 * GET /health — parse request, call use case, return response. No business logic here.
 */
export function healthController(_req: Request, res: Response): void {
  const status = getHealth();
  res.json(status);
}
