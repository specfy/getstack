import { z } from 'zod';

import { upsertCategoryTrendsRow } from '../../../../../models/categoryTrends.js';
import { envs } from '../../../../../utils/env.js';
import { categories } from '../../../../../utils/stacks.js';

import type { APIPutCategoryTop } from '../../../../../types/endpoint.js';
import type { TechType } from '@specfy/stack-analyser';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().refine((val) => categories.includes(val as TechType), {
    message: 'Invalid category',
  }),
});

const schemaBody = z.object({
  introduction: z.string().min(1),
  slug: z.string().min(1),
});

function isPgUniqueViolation(err: unknown): boolean {
  if (err === null || typeof err !== 'object') {
    return false;
  }
  const o = err as { code?: string; cause?: { code?: string } };
  return o.code === '23505' || o.cause?.code === '23505';
}

export const putCategoryTopRoute: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.put<APIPutCategoryTop>('/categories/:name/trends', async (req, reply) => {
    const secret =
      req.headers['x-admin-secret'] ??
      (req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null);

    const expectedSecret = envs.ADMIN_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return reply.status(401).send({ error: { code: 'forbidden', status: 401 } });
    }

    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const valBody = schemaBody.safeParse(req.body);
    if (valBody.error) {
      return reply.status(400).send({ error: { code: '400_invalid_body', status: 400 } });
    }

    const { introduction, slug } = valBody.data;

    try {
      await upsertCategoryTrendsRow({
        category: valParams.data.name,
        introduction,
        slug,
      });
    } catch (err: unknown) {
      if (isPgUniqueViolation(err)) {
        return reply.status(409).send({
          error: { code: '409_conflict', status: 409, reason: 'slug already in use' },
        });
      }
      throw err;
    }

    return reply.status(200).send({ success: true });
  });
};
