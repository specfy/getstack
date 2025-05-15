import { z } from 'zod';

import { getTopTechnologiesWithTrendByCategory } from '../../../../../models/technologies.js';

import type { APIGetCategoryLeaderboard } from '../../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().max(256),
});

export const getCategoryLeaderboard: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetCategoryLeaderboard>('/categories/:name/leaderboard', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params' } });
    }

    const params = valParams.data;

    const data = await getTopTechnologiesWithTrendByCategory(params.name);

    reply.status(200).send({
      success: true,
      data: data,
    });
  });
};
