/* eslint-disable unicorn/no-process-exit */
import * as Sentry from '@sentry/node';
import closeWithGrace from 'close-with-grace';
import Fastify from 'fastify';

import createApp, { options } from './app.js';
import { envs } from './utils/env.js';
import { defaultLogger as logger } from './utils/logger.js';

import './processor/cronAnalyzer.js';
import './processor/cronList.js';
import './crons/algolia.js';

// Initialize Sentry before anything else
if (envs.SENTRY_DSN) {
  Sentry.init({
    dsn: envs.SENTRY_DSN,
    environment: envs.SENTRY_ENVIRONMENT,
    integrations: [
      Sentry.httpIntegration(),
    ],
    tracesSampleRate: 1.0,
  });
}

// Instantiate Fastify with some config
const app = Fastify(options);

// Register your application as a normal plugin.
void app.register(createApp);

process
  .on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection at Promise', reason);
    if (envs.SENTRY_DSN) {
      Sentry.captureException(reason instanceof Error ? reason : new Error(String(reason)), {
        tags: {
          errorType: 'unhandledRejection',
        },
      });
    }
  })
  .on('uncaughtException', (err) => {
    logger.error('Uncaught Exception thrown', err);
    if (envs.SENTRY_DSN) {
      Sentry.captureException(err, {
        tags: {
          errorType: 'uncaughtException',
        },
      });
      // Flush Sentry before exiting
      void Sentry.flush(2000).then(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
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
});

logger.info('Starting...');
