import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

import { errorMiddleware } from './middlewares/error.middleware';
import { registerRoutes } from './router';

export function createApp(): Express {
  const app: Express = express();

  app.use(helmet());
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  registerRoutes(app);

  app.use(errorMiddleware);

  return app;
}
