import 'reflect-metadata';

import { container } from 'tsyringe';

import { getDatabaseConnection } from '@infrastructure/database/connection';

import { DI_TOKENS } from './di-tokens';
import { logger } from './logger';

// Infrastructure
container.register(DI_TOKENS.Logger, { useValue: logger });
container.register(DI_TOKENS.Knex, { useValue: getDatabaseConnection() });

export { container };
