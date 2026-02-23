import { z } from 'zod/v4';

export const templateIdParamSchema = z.object({
  id: z.uuid('Invalid template ID'),
});

export type TemplateIdParam = z.infer<typeof templateIdParamSchema>;
