import { z } from 'zod/v4';

export const uploadProgressBodySchema = z.object({
  percent: z.number().min(0).max(100),
});

export type UploadProgressBody = z.infer<typeof uploadProgressBodySchema>;
