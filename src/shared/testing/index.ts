/**
 * Test utilities, fakes, and factories for unit and integration tests.
 * No production code; only used in tests.
 */

import pino from 'pino';

export function createTestLogger(): pino.Logger {
  return pino({ level: 'silent' });
}
