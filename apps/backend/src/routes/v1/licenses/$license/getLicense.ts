import { z } from 'zod';

import {
  getLicenseCumulatedStars,
  getLicenseVolumePerWeek,
  getTopRepositoriesForLicense,
} from '../../../../models/licenses.js';
import { getLicense } from '../../../../models/licensesInfo.js';
import { getActiveWeek } from '../../../../models/progress.js';
import { notFound } from '../../../../utils/apiErrors.js';
import { getOrCache } from '../../../../utils/cache.js';

import type { APIGetLicense } from '../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  key: z
    .string()
    .regex(/[a-zA-Z0-9_.-]+/)
    .max(25),
});

export const getLIcense: FastifyPluginCallback = (fastify: FastifyInstance) => {
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
    const topRepos = await getOrCache(
      ['getTopRepositoriesForLicense', params.key, currentWeek],
      () => getTopRepositoriesForLicense({ license: params.key, currentWeek })
    );
    const volume = await getOrCache(['getLicenseVolumePerWeek', params.key, currentWeek], () =>
      getLicenseVolumePerWeek({ license: params.key, currentWeek })
    );
    const cumulatedStars = await getOrCache(
      ['getLicenseCumulatedStars', params.key, currentWeek],
      () => getLicenseCumulatedStars({ license: params.key, currentWeek })
    );

    reply.status(200).send({
      success: true,
      data: { license, topRepos, volume, cumulatedStars },
    });
  });
};
