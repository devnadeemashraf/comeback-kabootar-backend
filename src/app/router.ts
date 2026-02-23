import type { Express } from 'express';

import { authRoutes } from '@/features/authentication';
import { healthRoutes } from '@/features/health';

export function registerRoutes(app: Express) {
  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
}
