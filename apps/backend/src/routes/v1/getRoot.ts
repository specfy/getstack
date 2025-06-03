import { envs } from '../../utils/env.js';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getRoot: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get('/', async (_, reply) => {
    reply.status(200).send({
      success: true,
      data: {
        hash: envs.GIT_HASH,
      },
    });
  });
};
