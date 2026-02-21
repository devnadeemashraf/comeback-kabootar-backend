import type { Express } from 'express';

import { healthRoutes } from '@/features/health';

export function registerRoutes(app: Express) {
  app.use('/health', healthRoutes);
  app.use('/', (_req, res) => {
    return res.send('Gutur Guu');
  });
}
