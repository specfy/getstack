import { z } from 'zod';

import { getOrCache } from '../../../../../models/cache.js';
import { getActiveWeek } from '../../../../../models/progress.js';
import { getRepository } from '../../../../../models/repositories.js';
import { getTechnologiesByRepo } from '../../../../../models/technologies.js';
import { notFound } from '../../../../../utils/apiErrors.js';

import type { APIGetRepository } from '../../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  org: z.string().max(255),
  name: z.string().max(255),
});

export const getApiRepository: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetRepository>('/repositories/:org/:name', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const repo = await getOrCache({
      keys: ['getRepository', params.org, params.name],
      fn: () => getRepository(params),
    });
    if (!repo) {
      return notFound(reply);
    }

    const weeks = await getActiveWeek();
    const techs = await getOrCache({
      keys: ['getTechnologiesByRepo', repo.id, weeks.currentWeek],
      fn: () => getTechnologiesByRepo(repo, weeks.currentWeek),
    });

    reply.status(200).send({ success: true, data: { repo, techs } });
  });
};
