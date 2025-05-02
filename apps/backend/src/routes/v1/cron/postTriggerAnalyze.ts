import { cronAnalyzeGithubRepositories } from '../../../processor/cronAnalyzer.js';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const postCronTriggerAnalyze: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.post('/cron/trigger/analyze', async (_, reply) => {
    void cronAnalyzeGithubRepositories.fireOnTick();

    reply.status(200).send({
      success: true,
    });
  });
};
