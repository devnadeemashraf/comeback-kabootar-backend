import { inject, injectable } from 'tsyringe';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';
import { NotFoundError } from '@/shared/errors';

@injectable()
export class DeleteTemplateService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
  ) {}

  async execute(id: string, authorId: string): Promise<void> {
    const deleted = await this.templateRepo.delete(id, authorId);
    if (!deleted) throw new NotFoundError('Template not found');
  }
}
