import type { HealthStatus } from '../model/health.types';

/**
 * Use case: return current health status. No contracts needed for this minimal feature.
 */
export function getHealth(): HealthStatus {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
  };
}
