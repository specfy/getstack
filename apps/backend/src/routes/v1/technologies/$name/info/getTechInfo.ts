import { listIndexed } from '@specfy/stack-analyser/dist/common/techs.generated.js';
import { z } from 'zod';

import { getTechInfo } from '../../../../../models/techInfo.js';

import type { APIGetTechInfo } from '../../../../../types/endpoint.js';
import type { AllowedKeys } from '@specfy/stack-analyser';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  name: z.string().refine((val) => listIndexed[val as AllowedKeys], {
    message: 'Invalid tech',
  }),
});

export const getTechInfoRoute: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetTechInfo>('/technologies/:name/info', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: '400_invalid_params', status: 400 } });
    }

    const params = valParams.data;
    const row = await getTechInfo(params.name);

    if (!row) {
      return reply.status(200).send({
        success: true,
        data: {
          longDescription: null,
          website: null,
          github: null,
        },
      });
    }

    return reply.status(200).send({
      success: true,
      data: {
        longDescription: row.long_description,
        website: row.website,
        github: row.github,
      },
    });
  });
};
