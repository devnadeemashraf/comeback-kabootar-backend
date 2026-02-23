import { inject, injectable } from 'tsyringe';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';
import { NotFoundError, ValidationError } from '@/shared/errors';

const FREE_ATTACHMENT_LIMIT = 2;
const PREMIUM_ATTACHMENT_LIMIT = 10;

export interface ReportAttachmentCompleteInput {
  key: string;
  name: string;
}

@injectable()
export class ReportAttachmentCompleteService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
  ) {}

  async execute(
    templateId: string,
    authorId: string,
    input: ReportAttachmentCompleteInput,
    isPremium: boolean,
  ): Promise<void> {
    const template = await this.templateRepo.findById(templateId);
    if (!template || template.authorId !== authorId) {
      throw new NotFoundError('Template not found');
    }
    const limit = isPremium ? PREMIUM_ATTACHMENT_LIMIT : FREE_ATTACHMENT_LIMIT;
    const nextAttachments = [...template.attachments, { key: input.key, name: input.name }];
    if (nextAttachments.length > limit) {
      throw new ValidationError(
        `Attachment limit reached (${limit} for your tier)`,
        'ATTACHMENT_LIMIT',
      );
    }
    await this.templateRepo.update(templateId, authorId, {
      attachments: nextAttachments,
    });
  }
}
