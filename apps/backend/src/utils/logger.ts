import { pino } from 'pino';

import { envs } from './env.js';

import type { Level, LoggerOptions } from 'pino';

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#LogSeverity
const levelToSeverity: Record<string, string> = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL',
};

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

if (envs.IS_GCP && options.formatters) {
  options.formatters.level = function level(label) {
    const pinoLevel = label as Level;
    const severity = levelToSeverity[label] ?? 'INFO';
    // `@type` property tells Error Reporting to track even if there is no `stack_trace`
    // you might want to make this an option the plugin, in our case we do want error reporting for all errors, with or without a stack
    const typeProp =
      pinoLevel === 'error' || pinoLevel === 'fatal'
        ? {
            '@type':
              'type.googleapis.com/google.devtools.clouderrorreporting.v1beta1.ReportedErrorEvent',
          }
        : {};
    return { severity, ...typeProp };
  };
} else {
  options.transport = pretty;
}

export const logger = pino(options);
export type Logger = typeof logger;
