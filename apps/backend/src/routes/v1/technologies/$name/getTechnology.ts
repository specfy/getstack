import { z } from 'zod';

import {
  getTechnologyCumulatedStars,
  getTechnologyVolumePerWeek,
  getTopRepositoriesForTechnology,
} from '../../../../models/technologies.js';

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

    const topRepos = await getTopRepositoriesForTechnology(params.name);
    const volume = await getTechnologyVolumePerWeek(params.name);
    const cumulatedStars = await getTechnologyCumulatedStars(params.name);

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
