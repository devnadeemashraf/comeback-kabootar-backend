import * as z from 'zod/v4';

/** Schema for attachment entries. */
const attachmentSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
});

/** Body schema for PATCH /templates/:id. All fields optional. Max attachments enforced in service by tier. */
export const updateTemplateBodySchema = z.object({
  title: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  attachments: z.array(attachmentSchema).max(10).optional(),
  isPublic: z.boolean().optional(),
});
export type UpdateTemplateBody = z.infer<typeof updateTemplateBodySchema>;
