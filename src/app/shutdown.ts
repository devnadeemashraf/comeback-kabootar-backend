import http from 'node:http';

import { logger } from '@/shared/logger';

async function cleanup() {
  logger.info('Cleanup Success');
}

export async function shutdown(signal: string, server: http.Server) {
  logger.info({ pid: process.pid, signal }, 'Graceful Shutdown Initiated');

  server.close(async () => {
    await cleanup();
    process.exit(0);
  });
}
