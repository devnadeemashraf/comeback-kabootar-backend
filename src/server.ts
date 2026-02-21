import cluster from 'node:cluster';
import os from 'node:os';

import { config } from '@core/config';
import { logger } from '@core/logger';
import { createApp } from '@interfaces/http/app';

import { shutdown } from './shutdown';

if (cluster.isPrimary) {
  const numWorkers = config.cluster.workers || os.cpus().length;

  logger.info(
    { pid: process.pid, workers: numWorkers },
    `Primary process starting >> forking ${numWorkers} workers`,
  );

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    logger.warn({ pid: worker.process.pid, code, signal }, 'Worker died — restarting');
    cluster.fork();
  });
} else {
  const app = createApp();
  const server = app.listen(config.port, () => {
    logger.info({ pid: process.pid, port: config.port }, `Worker listening on :${config.port}`);
  });

  process.on('SIGTERM', () => shutdown('SIGTERM', server));
  process.on('SIGINT', () => shutdown('SIGINT', server));
}
