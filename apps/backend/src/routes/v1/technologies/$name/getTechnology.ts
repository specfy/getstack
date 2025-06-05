import { listIndexed } from '@specfy/stack-analyser/dist/common/techs.generated.js';
import { z } from 'zod';

import { getOrCache } from '../../../../models/cache.js';
import { getActiveWeek } from '../../../../models/progress.js';
import { getRepositories } from '../../../../models/repositories.js';
import {
  getTechnologyCumulatedStars,
  getTechnologyVolumePerWeek,
  getTopRepositoriesForTechnology,
} from '../../../../models/technologies.js';

import type { APIGetTechnology } from '../../../../types/endpoint.js';
import type { AllowedKeys } from '@specfy/stack-analyser';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().refine((val) => listIndexed[val as AllowedKeys], {
    message: 'Invalid category',
  }),
});

export const getTechnology: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetTechnology>('/technologies/:name', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const { currentWeek } = await getActiveWeek();

    const topRepos = await getOrCache({
      keys: ['getTopRepositoriesForTechnology', params.name, currentWeek],
      fn: async () => await getTopRepositoriesForTechnology({ tech: params.name, currentWeek }),
    });
    const volume = await getOrCache({
      keys: ['getTechnologyVolumePerWeek', params.name, currentWeek],
      fn: () => getTechnologyVolumePerWeek({ tech: params.name, currentWeek }),
    });
    const cumulatedStars = await getOrCache({
      keys: ['getTechnologyCumulatedStars', params.name, currentWeek],
      fn: () => getTechnologyCumulatedStars({ tech: params.name, currentWeek }),
    });

    const repos =
      topRepos.length > 0
        ? await getRepositories({
            ids: topRepos.map((row) => row.id),
          })
        : [];
    reply.status(200).send({
      success: true,
      data: {
        cumulatedStars,
        topRepos: repos.map((row) => {
          return {
            id: row.id,
            name: row.name,
            org: row.org,
            stars: row.stars,
            avatar_url: row.avatar_url,
          };
        }),
        volume,
      },
    });
  });
};
