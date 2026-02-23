import * as z from 'zod/v4';

/** Schema for attachment entries (key + display name). Max length enforced in service by tier (2 free / 10 premium). */
const attachmentSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
});

/** Body schema for POST /templates. No file upload in body; attachments added via presigned upload + report complete. */
export const createTemplateBodySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Body is required'),
  attachments: z.array(attachmentSchema).max(10).optional().default([]),
  isPublic: z.boolean().optional().default(false),
});
export type CreateTemplateBody = z.infer<typeof createTemplateBodySchema>;
