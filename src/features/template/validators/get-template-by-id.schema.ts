import * as z from 'zod/v4';

/** Params schema for routes that use template :id (GET/PATCH/DELETE by id, finalize, attachments, SSE). */
export const getTemplateByIdParamsSchema = z.object({
  id: z.string().uuid('Invalid template ID'),
});
export type GetTemplateByIdParams = z.infer<typeof getTemplateByIdParamsSchema>;
