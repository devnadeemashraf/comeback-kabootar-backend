export interface Template {
  id: string;
  authorId: string;
  title: string;
  subject: string;
  body: string;
  attachments: Record<string, unknown> | null;
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
  attachments: Record<string, unknown> | null;
  is_public: boolean;
  fork_count: number;
  star_count: number;
  created_at: Date;
  updated_at: Date;
}
