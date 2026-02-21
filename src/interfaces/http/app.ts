import cors from 'cors';
import express, { type Express } from 'express';
import helmet from 'helmet';

export function createApp(): Express {
  const app: Express = express();

  // register middlewares
  app.use(helmet({}));
  app.use(cors());

  app.use(express.json());

  // register routs
  app.get('/', (_req, res) => {
    res.send('Hello');
  });

  // register error handler

  return app;
}
