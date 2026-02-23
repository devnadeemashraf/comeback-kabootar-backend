import { Knex } from 'knex';
import { inject, injectable } from 'tsyringe';

import { INFRASTRUCTURE_TOKENS } from '@/app/di/tokens/infrastructure.tokens';
import { Logger } from '@/shared/logger';

@injectable()
export class RepositoryContext {
  constructor(
    @inject(INFRASTRUCTURE_TOKENS.Knex)
    public readonly knex: Knex,

    @inject(INFRASTRUCTURE_TOKENS.Logger)
    public readonly logger: Logger,
  ) {}
}
