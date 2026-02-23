export type TemplateStatus = 'draft' | 'ready';

export interface TemplateAttachment {
  key: string;
  name: string;
}

export interface Template {
  id: string;
  authorId: string;
  title: string;
  subject: string;
  body: string;
  attachments: TemplateAttachment[];
  status: TemplateStatus;
  isPublic: boolean;
  forkCount: number;
  starCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateRow {
  id: string;
  author_id: string;
  title: string;
  subject: string;
  body: string;
  attachments: TemplateAttachment[] | null;
  status: TemplateStatus;
  is_public: boolean;
  fork_count: number;
  star_count: number;
  created_at: Date;
  updated_at: Date;
}
