import { inject, injectable } from 'tsyringe';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { Template } from '@/entities/template';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';
import { NotFoundError, ValidationError } from '@/shared/errors';

const FREE_ATTACHMENT_LIMIT = 2;
const PREMIUM_ATTACHMENT_LIMIT = 10;

@injectable()
export class FinalizeTemplateService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
  ) {}

  async execute(id: string, authorId: string, isPremium: boolean): Promise<Template> {
    const template = await this.templateRepo.findById(id);
    if (!template || template.authorId !== authorId) {
      throw new NotFoundError('Template not found');
    }
    if (template.status === 'ready') return template;
    const limit = isPremium ? PREMIUM_ATTACHMENT_LIMIT : FREE_ATTACHMENT_LIMIT;
    if (template.attachments.length > limit) {
      throw new ValidationError(
        `Attachment count exceeds limit (${limit} for your tier)`,
        'ATTACHMENT_LIMIT',
      );
    }
    const updated = await this.templateRepo.update(id, authorId, {
      status: 'ready',
    });
    if (!updated) throw new NotFoundError('Template not found');
    return updated;
  }
}
