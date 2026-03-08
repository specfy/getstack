import { listIndexed } from '@specfy/stack-analyser/dist/common/techs.generated.js';
import { z } from 'zod';

import { upsertTechInfo } from '../../../../../models/techInfo.js';
import { envs } from '../../../../../utils/env.js';

import type { APIPutTechInfo } from '../../../../../types/endpoint.js';
import type { AllowedKeys } from '@specfy/stack-analyser';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().refine((val) => listIndexed[val as AllowedKeys], {
    message: 'Invalid tech',
  }),
});

const schemaBody = z.object({
  longDescription: z.string(),
  website: z.string().url().optional(),
  github: z.string().optional(),
});

export const putTechInfoRoute: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.put<APIPutTechInfo>('/technologies/:name/info', async (req, reply) => {
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

    const { name } = valParams.data;
    const { longDescription, website, github } = valBody.data;

    await upsertTechInfo({
      key: name,
      long_description: longDescription,
      website: website ?? null,
      github: github ?? null,
    });

    return reply.status(200).send({ success: true });
  });
};
