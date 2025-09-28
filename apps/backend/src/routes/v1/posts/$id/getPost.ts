import * as z from 'zod';

import { db } from '../../../../db/client.js';
import { notFound } from '../../../../utils/apiErrors.js';

import type { APIGetPost } from '../../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  id: z.coerce.number().min(1).max(1_000_000),
});

export const getPost: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetPost>('/posts/:id', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params: APIGetPost['Params'] = valParams.data;

    const post = await db
      .selectFrom('posts')
      .selectAll()
      .where('id', '=', params.id)
      .executeTakeFirst();
    if (!post) {
      return notFound(reply);
    }

    reply.status(200).send({
      success: true,
      data: {
        ...post,
        created_at: post.created_at.toISOString(),
        updated_at: post.updated_at.toISOString(),
      },
    });
  });
};
