import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { errorMiddleware } from './middlewares/error.middleware';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';
import { registerRoutes } from './router';

export function createApp(): Express {
  const app: Express = express();

  app.use(rateLimitMiddleware);
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  registerRoutes(app);

  app.use(errorMiddleware);

  return app;
}
