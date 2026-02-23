import { z } from 'zod/v4';

export const callbackQuerySchema = z.object({
  code: z.string().min(1, 'code is required'),
  state: z.string().min(1, 'state is required'),
});

/** Parsed query for GET /auth/google/callback (code, state). */
export type CallbackQuery = z.infer<typeof callbackQuerySchema>;
