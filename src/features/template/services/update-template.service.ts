import { inject, injectable } from 'tsyringe';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { Template } from '@/entities/template';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';
import { NotFoundError, ValidationError } from '@/shared/errors';

const FREE_ATTACHMENT_LIMIT = 2;
const PREMIUM_ATTACHMENT_LIMIT = 10;

export interface UpdateTemplateInput {
  title?: string;
  subject?: string;
  body?: string;
  attachments?: { key: string; name: string }[];
  status?: 'draft' | 'ready';
  isPublic?: boolean;
}

@injectable()
export class UpdateTemplateService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
  ) {}

  async execute(
    id: string,
    authorId: string,
    input: UpdateTemplateInput,
    isPremium: boolean,
  ): Promise<Template> {
    if (input.attachments !== undefined) {
      const limit = isPremium ? PREMIUM_ATTACHMENT_LIMIT : FREE_ATTACHMENT_LIMIT;
      if (input.attachments.length > limit) {
        throw new ValidationError(
          `Attachment count exceeds limit (${limit} for your tier)`,
          'ATTACHMENT_LIMIT',
        );
      }
    }
    const updated = await this.templateRepo.update(id, authorId, input);
    if (!updated) throw new NotFoundError('Template not found');
    return updated;
  }
}
