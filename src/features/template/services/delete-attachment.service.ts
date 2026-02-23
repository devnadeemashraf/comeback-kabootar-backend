import { inject, injectable } from 'tsyringe';

import { INFRASTRUCTURE_TOKENS } from '@/app/di/tokens/infrastructure.tokens';
import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';
import type { TemplateStorageFacade } from '@/infrastructure/storage/storage.types';
import { NotFoundError } from '@/shared/errors';

@injectable()
export class DeleteAttachmentService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
    @inject(INFRASTRUCTURE_TOKENS.TemplateStorageFacade)
    private readonly storage: TemplateStorageFacade,
  ) {}

  async execute(templateId: string, authorId: string, key: string): Promise<void> {
    const template = await this.templateRepo.findById(templateId);
    if (!template || template.authorId !== authorId) {
      throw new NotFoundError('Template not found');
    }
    const attachments = template.attachments.filter((a) => a.key !== key);
    if (attachments.length === template.attachments.length) {
      throw new NotFoundError('Attachment not found');
    }
    await this.templateRepo.update(templateId, authorId, { attachments });
    await this.storage.deleteObject(key);
  }
}
