/* eslint-disable unicorn/no-process-exit */
import closeWithGrace from 'close-with-grace';
import Fastify from 'fastify';

import createApp, { options } from './app.js';
import { cronAnalyzeGithubRepositories, cronListGithubRepositories } from './processor/index.js';
import { envs } from './utils/env.js';
import { logger } from './utils/logger.js';

// Instantiate Fastify with some config
const app = Fastify(options);

// Register your application as a normal plugin.
void app.register(createApp);

process
  .on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection at Promise', reason);
  })
  .on('uncaughtException', (err) => {
    logger.error('Uncaught Exception thrown', err);
    process.exit(1);
  });

// delay is the number of milliseconds for the graceful close to finish
const closeListeners = closeWithGrace({ delay: 500 }, async function ({ err }) {
  if (err !== undefined) {
    app.log.error(err);
  }

  await app.close();
});

app.addHook('onClose', async (instance) => {
  try {
    closeListeners.uninstall();
    await instance.close();
  } catch (err) {
    logger.error(err);
  }
});

// Start listening.
void app.listen({ host: '0.0.0.0', port: envs.PORT }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  logger.info(`Started http://localhost:${envs.PORT}`);

  void cronListGithubRepositories();
  void cronAnalyzeGithubRepositories();
});

logger.info('Starting...');
