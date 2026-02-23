import { inject, injectable } from 'tsyringe';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { Template } from '@/entities/template';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';
import { ValidationError } from '@/shared/errors';

const FREE_ATTACHMENT_LIMIT = 2;
const PREMIUM_ATTACHMENT_LIMIT = 10;

export interface CreateTemplateInput {
  title: string;
  subject: string;
  body: string;
  attachments?: { key: string; name: string }[];
  isPublic?: boolean;
}

@injectable()
export class CreateTemplateService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
  ) {}

  async execute(
    authorId: string,
    input: CreateTemplateInput,
    isPremium: boolean,
  ): Promise<Template> {
    const limit = isPremium ? PREMIUM_ATTACHMENT_LIMIT : FREE_ATTACHMENT_LIMIT;
    const attachments = input.attachments ?? [];
    if (attachments.length > limit) {
      throw new ValidationError(
        `Attachment count exceeds limit (${limit} for your tier)`,
        'ATTACHMENT_LIMIT',
      );
    }
    return this.templateRepo.create({
      authorId,
      title: input.title,
      subject: input.subject,
      body: input.body,
      attachments,
      isPublic: input.isPublic ?? false,
      status: 'draft',
    });
  }
}
