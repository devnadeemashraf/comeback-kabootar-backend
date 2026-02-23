import { inject, injectable } from 'tsyringe';

import { INFRASTRUCTURE_TOKENS } from '@/app/di/tokens/infrastructure.tokens';
import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';
import type { TemplateStorageFacade } from '@/infrastructure/storage/storage.types';
import { NotFoundError, ValidationError } from '@/shared/errors';

const FREE_ATTACHMENT_LIMIT = 2;
const PREMIUM_ATTACHMENT_LIMIT = 10;

export interface PresignedUploadUrlResult {
  url: string;
  key: string;
}

@injectable()
export class GetPresignedUploadUrlService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
    @inject(INFRASTRUCTURE_TOKENS.TemplateStorageFacade)
    private readonly storage: TemplateStorageFacade,
  ) {}

  async execute(
    templateId: string,
    authorId: string,
    fileName: string,
    contentType: string | undefined,
    isPremium: boolean,
  ): Promise<PresignedUploadUrlResult> {
    const template = await this.templateRepo.findById(templateId);
    if (!template || template.authorId !== authorId) {
      throw new NotFoundError('Template not found');
    }
    const limit = isPremium ? PREMIUM_ATTACHMENT_LIMIT : FREE_ATTACHMENT_LIMIT;
    if (template.attachments.length >= limit) {
      throw new ValidationError(
        `Attachment limit reached (${limit} for your tier)`,
        'ATTACHMENT_LIMIT',
      );
    }
    const { url, key } = await this.storage.getPresignedPutUrl(templateId, fileName, contentType);
    return { url, key };
  }
}
