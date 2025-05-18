import { z } from 'zod';

import { getActiveWeek } from '../../../../models/progress.js';
import { getTop10TechnologiesByCategoryForNWeeks } from '../../../../models/technologies.js';

import type { APIGetCategory } from '../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().max(256),
});

export const getCategory: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetCategory>('/categories/:name', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const { currentWeek } = await getActiveWeek();
    const top = await getTop10TechnologiesByCategoryForNWeeks({
      category: params.name,
      weeks: 4,
      currentWeek,
    });

    reply.status(200).send({
      success: true,
      data: { top },
    });
  });
};
