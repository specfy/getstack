/* eslint-disable @typescript-eslint/max-params */
import cors from '@fastify/cors';

import { routes } from './routes/index.js';
import { notFound, serverError } from './utils/apiErrors.js';
import { logger } from './utils/logger.js';

import type { FastifyInstance, FastifyPluginOptions, FastifyServerOptions } from 'fastify';

export default async function createApp(
  f: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> {
  f.addHook('onRequest', (req, _res, done) => {
    logger.info(`#${req.id} <- ${req.method} ${req.url}`);
    done();
  });
  f.addHook('onResponse', (_, res, done) => {
    logger.info(`#${res.request.id} -> ${res.statusCode}`);
    done();
  });

  await f.register(cors, {
    // Important for cookies to work
    origin: ['http://localhost:3000', 'http://localhost:5173', /\.onrender\.com$/, /\.run\.app$/],
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  f.setErrorHandler(function (error, _req, res) {
    logger.error(error instanceof Error ? error.message : error);
    // fastify will use parent error handler to handle this
    return serverError(res);
  });

  f.setNotFoundHandler(function (req, res) {
    return notFound(res, `${req.method} ${req.url}`);
  });

  f.removeAllContentTypeParsers();
  f.addContentTypeParser(
    'application/json',
    { parseAs: 'string', bodyLimit: 10_000 },
    function (_req, body, done) {
      try {
        const json = JSON.parse(body as string) as unknown;
        done(null, json);
      } catch (err) {
        done(err as Error);
      }
    }
  );

  await routes(f, opts);
}

export const options: FastifyServerOptions = {
  // logger: l.child({ svc: 'api' }),
  trustProxy: true,
  logger: false,
};
