import { z } from 'zod';

import { getActiveWeek } from '../../../../../models/progress.js';
import { getTopTechnologiesWithTrendByCategory } from '../../../../../models/technologies.js';
import { getOrCache } from '../../../../../utils/cache.js';

import type { APIGetCategoryLeaderboard } from '../../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().max(256),
});

export const getCategoryLeaderboard: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetCategoryLeaderboard>('/categories/:name/leaderboard', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const weeks = await getActiveWeek();
    const data = await getOrCache(
      ['getTopTechnologiesWithTrendByCategory', params.name, weeks.currentWeek, weeks.previousWeek],
      () => getTopTechnologiesWithTrendByCategory({ category: params.name, ...weeks })
    );

    reply.status(200).send({
      success: true,
      data: data,
    });
  });
};
