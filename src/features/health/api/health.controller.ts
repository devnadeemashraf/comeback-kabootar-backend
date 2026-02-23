import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { GetHealthService } from '../service/get-health.service';

import { SERVICE_TOKENS } from '@/app/di/tokens/service.tokens';
import { ok } from '@/shared/api/response';

@injectable()
class HealthController {
  constructor(
    @inject(SERVICE_TOKENS.GetHealthService)
    private getHealthService: GetHealthService,
  ) {}

  async getHealth(_req: Request, res: Response, _next: NextFunction) {
    const result = await this.getHealthService.execute();

    ok(res, result);
  }
}

export { HealthController };
