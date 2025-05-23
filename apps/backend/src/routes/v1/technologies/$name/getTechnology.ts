import { z } from 'zod';

import { getActiveWeek } from '../../../../models/progress.js';
import {
  getTechnologyCumulatedStars,
  getTechnologyVolumePerWeek,
  getTopRepositoriesForTechnology,
} from '../../../../models/technologies.js';
import { getOrCache } from '../../../../utils/cache.js';

import type { APIGetTechnology } from '../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z
    .string()
    .regex(/[a-zA-Z0-9_.]+/)
    .max(256),
});

export const getTechnology: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetTechnology>('/technologies/:name', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const { currentWeek } = await getActiveWeek();

    const topRepos = await getOrCache(
      ['getTopRepositoriesForTechnology', params.name, currentWeek],
      () => getTopRepositoriesForTechnology({ tech: params.name, currentWeek })
    );
    const volume = await getOrCache(['getTechnologyVolumePerWeek', params.name, currentWeek], () =>
      getTechnologyVolumePerWeek({ tech: params.name, currentWeek })
    );
    const cumulatedStars = await getOrCache(
      ['getTechnologyCumulatedStars', params.name, currentWeek],
      () => getTechnologyCumulatedStars({ tech: params.name, currentWeek })
    );

    reply.status(200).send({
      success: true,
      data: {
        cumulatedStars,
        topRepos: topRepos.map((row) => {
          return {
            name: row.name,
            org: row.org,
            stars: row.stars,
            url: row.url,
            avatar_url: row.avatar_url,
          };
        }),
        volume,
      },
    });
  });
};
