import { z } from 'zod';

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

    const data = await getTopRelatedTechnology(params.name);

    reply.status(200).send({ success: true, data });
  });
};
