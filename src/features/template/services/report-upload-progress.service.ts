import { inject, injectable } from 'tsyringe';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { TEMPLATE_EVENT_BUS_TOKEN } from '@/app/di/tokens/service.tokens';
import { TemplateEventBus } from '@/features/template/template-event-bus';
import type { TemplateRepositoryPostgres } from '@/infrastructure/db/repositories/pg/template.repo.pg';

@injectable()
export class ReportUploadProgressService {
  constructor(
    @inject(REPOSITORY_TOKENS.TemplateRepositoryPostgres)
    private readonly templateRepo: TemplateRepositoryPostgres,
    @inject(TEMPLATE_EVENT_BUS_TOKEN)
    private readonly eventBus: TemplateEventBus,
  ) {}

  /** Store progress and broadcast to SSE subscribers for this template. */
  async execute(
    templateId: string,
    authorId: string,
    uploadId: string,
    percent: number,
  ): Promise<void> {
    const template = await this.templateRepo.findById(templateId);
    if (!template || template.authorId !== authorId) return; // no throw for progress
    this.eventBus.emitProgress(templateId, uploadId, percent);
  }
}
