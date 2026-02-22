import type { Request, Response } from 'express';

import { getHealth } from '@/features/health/service/get-health.usecase';
import { successResponse } from '@/shared/api/response';

export function healthController(_req: Request, res: Response): void {
  const status = getHealth();
  res.json(successResponse(status));
}
