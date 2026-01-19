import * as Sentry from '@sentry/node';
import { pino } from 'pino';

import { envs, isProd } from './env.js';

import type { LoggerOptions } from 'pino';

export const options: LoggerOptions = {
  level: 'info',
  timestamp: true,
  base: {
    svc: 'api',
  },
  formatters: {
    level(label) {
      return { level: label };
    },
  },
  hooks: {
    // By default pino does Sprintf instead we merge objects.
    logMethod(args, method) {
      const final: { [key: string]: unknown; message: string; data: Record<string, unknown> } = {
        message: '',
        data: {},
      };

      for (const msg of args.reverse()) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const m: null | Record<string, unknown> | string | undefined = msg;

        if (typeof m === 'string') {
          final.message += m;
        } else if (typeof m === 'object' && m instanceof Error) {
          final['err'] = m.message;
          final['stack_trace'] = m.stack;
          final['cause'] = m.cause;
        } else {
          final.data = { ...final.data, ...m };
        }
      }
      Reflect.apply(method, this, [final as unknown as string]);
    },
  },
  messageKey: 'message',
};

const pretty = {
  level: 'info',
  target: 'pino-pretty',
  options: {
    colorize: true,
    singleLine: true,
    messageFormat: '[{svc}] \u001B[37m{message}',
    translateTime: 'HH:MM',
    ignore: 'svc,serviceContext,message',
  },
};

if (envs.IS_PROD && options.formatters) {
  //
} else {
  options.transport = pretty;
}

export const defaultLogger = pino(options);
export type Logger = typeof defaultLogger;

/**
 * Logs an error locally and sends to Sentry in production.
 * Always logs locally for debugging, and sends to Sentry in production.
 */
// eslint-disable-next-line @typescript-eslint/max-params
export function logError(message: Error, err?: unknown, extra: Record<string, unknown> = {}): void {
  // Always log locally
  if (err !== undefined && err !== null) {
    defaultLogger.error({ ...extra, err }, message.message);
  } else {
    defaultLogger.error(extra, message.message);
  }

  // In production, also send to Sentry
  if (isProd && envs.SENTRY_DSN) {
    const context: { level?: 'error'; extra?: Record<string, unknown> } = { level: 'error' };
    if (Object.keys(extra).length > 0) {
      context.extra = extra;
    }
    if (err !== undefined && err !== null) {
      message.cause = err;
    }

    Sentry.captureException(message, Object.keys(context).length > 0 ? context : undefined);
  }
}
