import type { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';

import { CreateTemplateService } from '../services/create-template.service';
import { DeleteAttachmentService } from '../services/delete-attachment.service';
import { DeleteTemplateService } from '../services/delete-template.service';
import { FinalizeTemplateService } from '../services/finalize-template.service';
import { GetAllTemplatesService } from '../services/get-all-templates.service';
import { GetPresignedUploadUrlService } from '../services/get-presigned-upload-url.service';
import { GetTemplateByIdService } from '../services/get-template-by-id.service';
import { ReportAttachmentCompleteService } from '../services/report-attachment-complete.service';
import { ReportUploadProgressService } from '../services/report-upload-progress.service';
import { UpdateTemplateService } from '../services/update-template.service';
import { attachmentCompleteBodySchema } from '../validators/attachment-complete.schema';
import { createTemplateBodySchema } from '../validators/create-template.schema';
import { getTemplateByIdParamsSchema } from '../validators/get-template-by-id.schema';
import { presignAttachmentBodySchema } from '../validators/presign-attachment.schema';
import { updateTemplateBodySchema } from '../validators/update-template.schema';
import { uploadProgressBodySchema } from '../validators/upload-progress.schema';

import { REPOSITORY_TOKENS } from '@/app/di/tokens/repository.tokens';
import { SERVICE_TOKENS, TEMPLATE_EVENT_BUS_TOKEN } from '@/app/di/tokens/service.tokens';
import type { TemplateEventBus } from '@/features/template/template-event-bus';
import type { UserRepositoryPostgres } from '@/infrastructure/db/repositories/pg/user.repo.pg';
import { created, noContent, notFound, ok, validationError } from '@/shared/api/response';
import { AppError, NotFoundError } from '@/shared/errors';

@injectable()
class TemplateController {
  constructor(
    @inject(SERVICE_TOKENS.GetAllTemplatesService)
    private readonly getAllTemplatesService: GetAllTemplatesService,
    @inject(SERVICE_TOKENS.GetTemplateByIdService)
    private readonly getTemplateByIdService: GetTemplateByIdService,
    @inject(SERVICE_TOKENS.CreateTemplateService)
    private readonly createTemplateService: CreateTemplateService,
    @inject(SERVICE_TOKENS.UpdateTemplateService)
    private readonly updateTemplateService: UpdateTemplateService,
    @inject(SERVICE_TOKENS.DeleteTemplateService)
    private readonly deleteTemplateService: DeleteTemplateService,
    @inject(SERVICE_TOKENS.FinalizeTemplateService)
    private readonly finalizeTemplateService: FinalizeTemplateService,
    @inject(SERVICE_TOKENS.GetPresignedUploadUrlService)
    private readonly getPresignedUploadUrlService: GetPresignedUploadUrlService,
    @inject(SERVICE_TOKENS.ReportAttachmentCompleteService)
    private readonly reportAttachmentCompleteService: ReportAttachmentCompleteService,
    @inject(SERVICE_TOKENS.ReportUploadProgressService)
    private readonly reportUploadProgressService: ReportUploadProgressService,
    @inject(SERVICE_TOKENS.DeleteAttachmentService)
    private readonly deleteAttachmentService: DeleteAttachmentService,
    @inject(REPOSITORY_TOKENS.UserRepositoryPostgres)
    private readonly userRepo: UserRepositoryPostgres,
    @inject(TEMPLATE_EVENT_BUS_TOKEN)
    private readonly eventBus: TemplateEventBus,
  ) {}

  private async getIsPremium(userId: string): Promise<boolean> {
    const user = await this.userRepo.findById(userId);
    return user?.isPremium ?? false;
  }

  async getAllTemplates(req: Request, res: Response): Promise<void> {
    const authorId = req.user!.id;
    const result = await this.getAllTemplatesService.execute(authorId);
    ok(res, result);
  }

  async getTemplateById(req: Request, res: Response): Promise<void> {
    const parsed = getTemplateByIdParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      validationError(res, 'Invalid template ID', 'INVALID_PARAMS');
      return;
    }
    const { id } = parsed.data;
    const authorId = req.user!.id;
    const template = await this.getTemplateByIdService.execute(id, authorId);
    if (!template) {
      notFound(res, 'Template not found');
      return;
    }
    ok(res, template);
  }

  async createNewTemplate(req: Request, res: Response): Promise<void> {
    const parsed = createTemplateBodySchema.safeParse(req.body);
    if (!parsed.success) {
      validationError(res, 'Validation failed', 'VALIDATION_ERROR');
      return;
    }
    const authorId = req.user!.id;
    const isPremium = await this.getIsPremium(authorId);
    try {
      const template = await this.createTemplateService.execute(authorId, parsed.data, isPremium);
      created(res, template);
    } catch (err) {
      if (err instanceof AppError) {
        validationError(res, err.message, err.code);
        return;
      }
      throw err;
    }
  }

  async updateExistingTemplateById(req: Request, res: Response): Promise<void> {
    const paramsParsed = getTemplateByIdParamsSchema.safeParse(req.params);
    const bodyParsed = updateTemplateBodySchema.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      validationError(res, 'Invalid params or body', 'VALIDATION_ERROR');
      return;
    }
    const { id } = paramsParsed.data;
    const authorId = req.user!.id;
    const isPremium = await this.getIsPremium(authorId);
    try {
      const template = await this.updateTemplateService.execute(
        id,
        authorId,
        bodyParsed.data,
        isPremium,
      );
      ok(res, template);
    } catch (err) {
      if (err instanceof NotFoundError) {
        notFound(res, err.message);
        return;
      }
      if (err instanceof AppError) {
        validationError(res, err.message, err.code);
        return;
      }
      throw err;
    }
  }

  async deleteExistingTemplateById(req: Request, res: Response): Promise<void> {
    const parsed = getTemplateByIdParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      validationError(res, 'Invalid template ID', 'INVALID_PARAMS');
      return;
    }
    const { id } = parsed.data;
    const authorId = req.user!.id;
    try {
      await this.deleteTemplateService.execute(id, authorId);
      noContent(res);
    } catch (err) {
      if (err instanceof NotFoundError) {
        notFound(res, err.message);
        return;
      }
      throw err;
    }
  }

  async finalizeTemplate(req: Request, res: Response): Promise<void> {
    const parsed = getTemplateByIdParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      validationError(res, 'Invalid template ID', 'INVALID_PARAMS');
      return;
    }
    const { id } = parsed.data;
    const authorId = req.user!.id;
    const isPremium = await this.getIsPremium(authorId);
    try {
      const template = await this.finalizeTemplateService.execute(id, authorId, isPremium);
      ok(res, template);
    } catch (err) {
      if (err instanceof NotFoundError) {
        notFound(res, err.message);
        return;
      }
      if (err instanceof AppError) {
        validationError(res, err.message, err.code);
        return;
      }
      throw err;
    }
  }

  async getPresignedUploadUrl(req: Request, res: Response): Promise<void> {
    const paramsParsed = getTemplateByIdParamsSchema.safeParse(req.params);
    const bodyParsed = presignAttachmentBodySchema.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      validationError(res, 'Invalid params or body', 'VALIDATION_ERROR');
      return;
    }
    const { id } = paramsParsed.data;
    const authorId = req.user!.id;
    const isPremium = await this.getIsPremium(authorId);
    try {
      const result = await this.getPresignedUploadUrlService.execute(
        id,
        authorId,
        bodyParsed.data.fileName,
        bodyParsed.data.contentType,
        isPremium,
      );
      ok(res, result);
    } catch (err) {
      if (err instanceof NotFoundError) {
        notFound(res, err.message);
        return;
      }
      if (err instanceof AppError) {
        validationError(res, err.message, err.code);
        return;
      }
      throw err;
    }
  }

  async reportAttachmentComplete(req: Request, res: Response): Promise<void> {
    const paramsParsed = getTemplateByIdParamsSchema.safeParse(req.params);
    const bodyParsed = attachmentCompleteBodySchema.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      validationError(res, 'Invalid params or body', 'VALIDATION_ERROR');
      return;
    }
    const { id } = paramsParsed.data;
    const authorId = req.user!.id;
    const isPremium = await this.getIsPremium(authorId);
    const emit = (key: string, name: string) => this.eventBus.emitAttachmentComplete(id, key, name);
    try {
      await this.reportAttachmentCompleteService.execute(
        id,
        authorId,
        bodyParsed.data,
        isPremium,
        emit,
      );
      noContent(res);
    } catch (err) {
      if (err instanceof NotFoundError) {
        notFound(res, err.message);
        return;
      }
      if (err instanceof AppError) {
        validationError(res, err.message, err.code);
        return;
      }
      throw err;
    }
  }

  async reportUploadProgress(req: Request, res: Response): Promise<void> {
    const paramsParsed = getTemplateByIdParamsSchema.safeParse(req.params);
    const bodyParsed = uploadProgressBodySchema.safeParse(req.body);
    if (!paramsParsed.success || !bodyParsed.success) {
      validationError(res, 'Invalid params or body', 'VALIDATION_ERROR');
      return;
    }
    const { id, uploadId } = req.params as { id: string; uploadId: string };
    const authorId = req.user!.id;
    await this.reportUploadProgressService.execute(id, authorId, uploadId, bodyParsed.data.percent);
    noContent(res);
  }

  async deleteAttachment(req: Request, res: Response): Promise<void> {
    const paramsParsed = getTemplateByIdParamsSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      validationError(res, 'Invalid template ID', 'INVALID_PARAMS');
      return;
    }
    const { id } = paramsParsed.data;
    const rawKey = req.params.key;
    const key = typeof rawKey === 'string' ? decodeURIComponent(rawKey) : '';
    if (!key) {
      validationError(res, 'Missing attachment key', 'INVALID_PARAMS');
      return;
    }
    const authorId = req.user!.id;
    try {
      await this.deleteAttachmentService.execute(id, authorId, key);
      noContent(res);
    } catch (err) {
      if (err instanceof NotFoundError) {
        notFound(res, err.message);
        return;
      }
      throw err;
    }
  }

  subscribeTemplateEvents(req: Request, res: Response): void {
    const parsed = getTemplateByIdParamsSchema.safeParse(req.params);
    if (!parsed.success) {
      validationError(res, 'Invalid template ID', 'INVALID_PARAMS');
      return;
    }
    const { id } = parsed.data;
    const authorId = req.user!.id;
    this.getTemplateByIdService.execute(id, authorId).then((template) => {
      if (!template) {
        notFound(res, 'Template not found');
        return;
      }
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.flushHeaders?.();
      const listener = (event: { type: string; data: unknown }) => {
        const data = JSON.stringify(event);
        res.write(`event: ${event.type}\ndata: ${data}\n\n`);
      };
      this.eventBus.on(id, listener);
      req.on('close', () => this.eventBus.off(id));
    });
  }
}

export { TemplateController };
