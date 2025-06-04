import { z } from 'zod';

import { getOrCache } from '../../../../models/cache.js';
import {
  getLicenseCumulatedStars,
  getLicenseVolumePerWeek,
  getTopRepositoriesForLicense,
} from '../../../../models/licenses.js';
import { getLicense } from '../../../../models/licensesInfo.js';
import { getActiveWeek } from '../../../../models/progress.js';
import { getRepositories } from '../../../../models/repositories.js';
import { notFound } from '../../../../utils/apiErrors.js';

import type { APIGetLicense } from '../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  key: z
    .string()
    .regex(/[a-zA-Z0-9_.-]+/)
    .max(25),
});

export const getApiLicense: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetLicense>('/licenses/:key', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const license = await getLicense(params.key);
    if (!license) {
      return notFound(reply);
    }

    const { currentWeek } = await getActiveWeek();
    const topRepos = await getOrCache({
      keys: ['getTopRepositoriesForLicense', params.key, currentWeek],
      fn: () => getTopRepositoriesForLicense({ license: params.key, currentWeek }),
    });
    const volume = await getOrCache({
      keys: ['getLicenseVolumePerWeek', params.key, currentWeek],
      fn: () => getLicenseVolumePerWeek({ license: params.key, currentWeek }),
    });
    const cumulatedStars = await getOrCache({
      keys: ['getLicenseCumulatedStars', params.key, currentWeek],
      fn: () => getLicenseCumulatedStars({ license: params.key, currentWeek }),
    });

    const repos = await getRepositories({
      ids: topRepos.map((row) => row.id),
    });

    reply.status(200).send({
      success: true,
      data: {
        license,
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
        cumulatedStars,
      },
    });
  });
};
