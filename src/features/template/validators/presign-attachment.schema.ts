import { z } from 'zod/v4';

export const presignAttachmentBodySchema = z.object({
  fileName: z.string().min(1, 'fileName is required'),
  contentType: z.string().optional(),
});

export type PresignAttachmentBody = z.infer<typeof presignAttachmentBodySchema>;
