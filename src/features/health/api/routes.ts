import { Router } from 'express';

import { healthController } from './health.controller';

const router = Router();

router.get('/', healthController);

export const healthRoutes: ReturnType<typeof Router> = router;
