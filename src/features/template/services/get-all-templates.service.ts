import { inject, injectable } from 'tsyringe';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { Template } from '@/entities/template';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';

@injectable()
class GetAllTemplatesService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepositoryPostgres: TemplateRepositoryPostgres,
  ) {}

  async execute(authorId: string): Promise<Template[]> {
    return this.templateRepositoryPostgres.findAllForAuthorById(authorId);
  }
}

export { GetAllTemplatesService };
