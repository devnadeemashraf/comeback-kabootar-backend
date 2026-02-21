/**
 * Redis configuration. Stub until Redis is used (e.g. for BullMQ or cache).
 * Validation and defaults can be added here when needed.
 */

export const redisConfig = {
  url: process.env.REDIS_URL ?? 'redis://localhost:6379',
} as const;
