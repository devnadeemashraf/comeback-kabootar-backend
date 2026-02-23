import { z } from 'zod/v4';

export const attachmentCompleteBodySchema = z.object({
  key: z.string().min(1, 'key is required'),
  name: z.string().min(1, 'name is required'),
});

export type AttachmentCompleteBody = z.infer<typeof attachmentCompleteBodySchema>;
