import * as Sentry from '@sentry/react';
import { StartClient } from '@tanstack/react-start';
import { hydrateRoot } from 'react-dom/client';

import { SENTRY_DSN, SENTRY_ENVIRONMENT } from './lib/envs';
import { createRouter } from './router';

// Initialize Sentry
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: SENTRY_ENVIRONMENT === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 0,
  });
}

const router = createRouter();

hydrateRoot(document, <StartClient router={router} />);
