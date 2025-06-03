import { z } from 'zod';

import { getOrCache } from '../../../../../models/cache.js';
import { getActiveWeek } from '../../../../../models/progress.js';
import { getTopRelatedTechnology } from '../../../../../models/technologies.js';

import type { APIGetTopRelatedTechnology } from '../../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z
    .string()
    .regex(/[a-zA-Z0-9_.]+/)
    .max(256),
});

export const getTechnologyRelated: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetTopRelatedTechnology>('/technologies/:name/related', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const { currentWeek } = await getActiveWeek();
    const data = await getOrCache({
      keys: ['getTopRelatedTechnology', params.name, currentWeek],
      fn: () => getTopRelatedTechnology({ tech: params.name, currentWeek }),
    });

    reply.status(200).send({ success: true, data });
  });
};
