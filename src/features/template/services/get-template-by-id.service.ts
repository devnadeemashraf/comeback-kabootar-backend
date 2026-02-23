import { inject, injectable } from 'tsyringe';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { Template } from '@/entities/template';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';

@injectable()
export class GetTemplateByIdService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
  ) {}

  /** Returns template if found and author matches; otherwise null (controller returns 404). */
  async execute(id: string, authorId: string): Promise<Template | null> {
    const template = await this.templateRepo.findById(id);
    if (!template || template.authorId !== authorId) return null;
    return template;
  }
}
