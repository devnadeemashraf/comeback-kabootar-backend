import type { Express } from 'express';

import { authRoutes } from '@/features/authentication';
import { healthRoutes } from '@/features/health';
import { templateRoutes } from '@/features/template';

export function registerRoutes(app: Express) {
  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/templates', templateRoutes);
}
