import { Router } from 'express';

import { HealthController } from './health.controller';

import { container } from '@/app/di/container';
import { CONTROLLER_TOKENS } from '@/app/di/tokens/controller.tokens';

const router = Router();

const healthController = container.resolve<HealthController>(CONTROLLER_TOKENS.HealthController);

router.get('/', healthController.getHealth);

export const healthRoutes: ReturnType<typeof Router> = router;
