import { db } from '../../../db/client.js';

import type { APIGetPosts } from '../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getPosts: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetPosts>('/posts', async (_, reply) => {
    const posts = await db.selectFrom('posts').selectAll().orderBy('updated_at', 'desc').execute();

    reply.status(200).send({
      success: true,
      data: posts.map((p) => {
        return {
          id: p.id,
          title: p.title,
          summary: p.summary,
          metadata: p.metadata,
          updated_at: p.updated_at.toISOString(),
        };
      }),
    });
  });
};
