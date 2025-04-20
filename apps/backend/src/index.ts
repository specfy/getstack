/* eslint-disable unicorn/no-process-exit */
import closeWithGrace from 'close-with-grace';
import Fastify from 'fastify';

import appService, { options } from './app.js';
import { envs } from './utils/env.js';
import { logger } from './utils/logger.js';

// Instantiate Fastify with some config
const app = Fastify(options);

// Register your application as a normal plugin.
void app.register(appService);

process
  .on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection at Promise', reason);
  })
  .on('uncaughtException', (err) => {
    logger.error('Uncaught Exception thrown', err);
    process.exit(1);
  });

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: 500 }, async function ({ err }: any) {
  if (err !== undefined) {
    app.log.error(err);
  }

  await app.close();
});

app.addHook('onClose', async (_, done) => {
  try {
    closeListeners.uninstall();
  } catch (err) {
    logger.error(err);
  }
  done();
});

// Start listening.
app.listen({ host: '0.0.0.0', port: Number.parseInt(envs.PORT, 10) }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

void (async () => {
  logger.info('Starting...');
})();
