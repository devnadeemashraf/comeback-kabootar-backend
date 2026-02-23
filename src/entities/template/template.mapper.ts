import type { Template, TemplateRow } from './template.entity';

export function mapTemplateRowToDomain(row: TemplateRow): Template {
  return {
    id: row.id,
    authorId: row.author_id,
    title: row.title,
    subject: row.subject,
    body: row.body,
    attachments: Array.isArray(row.attachments) ? row.attachments : [],
    status: row.status === 'ready' ? 'ready' : 'draft',
    isPublic: row.is_public,
    forkCount: row.fork_count,
    starCount: row.star_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapTemplateRowsToDomain(rows: TemplateRow[]): Template[] {
  return rows.map(mapTemplateRowToDomain);
}
