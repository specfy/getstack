import { cronListGithubRepositories } from '../../../processor/cronList.js';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const postCronTriggerList: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.post('/cron/trigger/list', async (_, reply) => {
    void cronListGithubRepositories.fireOnTick();

    reply.status(200).send({
      success: true,
    });
  });
};
