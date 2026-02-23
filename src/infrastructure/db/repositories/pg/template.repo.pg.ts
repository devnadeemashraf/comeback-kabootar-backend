import { inject, injectable } from 'tsyringe';

import { RepositoryContext } from '@/app/context/RepositoryContext';
import { CONTEXT_TOKENS } from '@/app/di/tokens/context.tokens';
import type { Template, TemplateAttachment, TemplateStatus } from '@/entities/template';
import {
  mapTemplateRowsToDomain,
  mapTemplateRowToDomain,
} from '@/entities/template/template.mapper';
import type { TransactionContext } from '@/infrastructure/db/transaction';

export interface CreateTemplateData {
  authorId: string;
  title: string;
  subject: string;
  body: string;
  attachments?: TemplateAttachment[] | null;
  isPublic?: boolean;
  status?: TemplateStatus;
}

export interface UpdateTemplateData {
  title?: string;
  subject?: string;
  body?: string;
  attachments?: TemplateAttachment[] | null;
  status?: TemplateStatus;
  isPublic?: boolean;
}

const REPO_NAME = 'TemplateRepositoryPostgres';

@injectable()
class TemplateRepositoryPostgres {
  constructor(
    @inject(CONTEXT_TOKENS.RepositoryContext)
    private readonly repoCtx: RepositoryContext,
  ) {}

  async findById(id: string, tx?: TransactionContext): Promise<Template | null> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'findById', id },
      'repository execution',
    );
    const row = await db('templates').where('id', id).first();
    const result = row ? mapTemplateRowToDomain(row) : null;
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'findById', found: !!result },
      'repository completed',
    );
    return result;
  }

  async findAllForAuthorById(authorId: string, tx?: TransactionContext): Promise<Template[]> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'findAllForAuthorById', authorId },
      'repository execution',
    );
    const rows = await db('templates').where('author_id', authorId);
    const result = mapTemplateRowsToDomain(rows ?? []);
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'findAllForAuthorById', count: result.length },
      'repository completed',
    );
    return result;
  }

  async create(data: CreateTemplateData, tx?: TransactionContext): Promise<Template> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'create', authorId: data.authorId },
      'repository execution',
    );
    const row = await db('templates')
      .insert({
        author_id: data.authorId,
        title: data.title,
        subject: data.subject,
        body: data.body,
        attachments: data.attachments ?? null,
        is_public: data.isPublic ?? false,
        status: data.status ?? 'draft',
        fork_count: 0,
        star_count: 0,
      })
      .returning('*')
      .then((rows) => rows[0]);
    if (!row) throw new Error('Template create returned no row');
    const result = mapTemplateRowToDomain(row);
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'create', id: result.id },
      'repository completed',
    );
    return result;
  }

  async update(
    id: string,
    authorId: string,
    data: UpdateTemplateData,
    tx?: TransactionContext,
  ): Promise<Template | null> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'update', id },
      'repository execution',
    );
    const updatePayload: Record<string, unknown> = { updated_at: this.repoCtx.knex.fn.now() };
    if (data.title !== undefined) updatePayload.title = data.title;
    if (data.subject !== undefined) updatePayload.subject = data.subject;
    if (data.body !== undefined) updatePayload.body = data.body;
    if (data.attachments !== undefined) updatePayload.attachments = data.attachments;
    if (data.status !== undefined) updatePayload.status = data.status;
    if (data.isPublic !== undefined) updatePayload.is_public = data.isPublic;
    const row = await db('templates')
      .where({ id, author_id: authorId })
      .update(updatePayload)
      .returning('*')
      .then((rows) => rows[0]);
    const result = row ? mapTemplateRowToDomain(row) : null;
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'update', updated: !!result },
      'repository completed',
    );
    return result;
  }

  async delete(id: string, authorId: string, tx?: TransactionContext): Promise<boolean> {
    const db = this.repoCtx.getExecutor(tx);
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'delete', id },
      'repository execution',
    );
    const deleted = await db('templates').where({ id, author_id: authorId }).delete();
    this.repoCtx.logger.debug(
      { repository: REPO_NAME, method: 'delete', deleted: deleted > 0 },
      'repository completed',
    );
    return deleted > 0;
  }
}

export { TemplateRepositoryPostgres };
