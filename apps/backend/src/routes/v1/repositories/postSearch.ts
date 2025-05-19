import { z } from 'zod';

import { searchRepository } from '../../../models/repositories.js';
import { getOrCache } from '../../../utils/cache.js';

import type { APIPostRepositorySearch } from '../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const bodyParams = z.object({
  search: z.string().max(255),
});

export const postSearchRepository: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.post<APIPostRepositorySearch>('/repositories/search', async (req, reply) => {
    const valBody = bodyParams.safeParse(req.body);
    if (valBody.error) {
      return reply.status(400).send({ error: { code: '400_invalid_body', status: 400 } });
    }

    const body = valBody.data;
    const res = await getOrCache(['searchRepository', body.search], () =>
      searchRepository(body.search)
    );

    reply.status(200).send({
      success: true,
      data: res,
    });
  });
};
