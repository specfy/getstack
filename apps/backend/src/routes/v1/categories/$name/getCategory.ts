import { z } from 'zod';

import {
  getTop10TechnologiesByCategoryForNWeeks,
  getTopTechnologiesWithTrendByCategory,
} from '../../../../models/technologies.js';

import type { APIGetCategory } from '../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().max(256),
});

export const getCategory: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetCategory>('/categories/:name', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params' } });
    }

    const params = valParams.data;

    const data = await getTopTechnologiesWithTrendByCategory(params.name);
    const top = await getTop10TechnologiesByCategoryForNWeeks(params.name, 4);

    reply.status(200).send({
      success: true,
      data: { list: data, top },
    });
  });
};
