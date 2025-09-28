import * as z from 'zod';

import { getRepository } from '../../../../../models/repositories.js';
import { refreshOne } from '../../../../../processor/cronList.js';
import { notFound, serverError } from '../../../../../utils/apiErrors.js';
import { octokit } from '../../../../../utils/github.js';

import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const schemaParams = z.object({
  org: z.string().max(255),
  name: z.string().max(255),
});

export const postRefreshOne: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.post('/repositories/:org/:name/refresh', async (req, reply) => {
    const valParams = schemaParams.safeParse(req.params);
    if (valParams.error) {
      return reply.status(400).send({ error: { code: 'invalid_params', status: 400 } });
    }

    const params = valParams.data;

    const repo = await getRepository(params);
    if (!repo) {
      return notFound(reply);
    }

    try {
      const res = await octokit.rest.repos.get({ owner: repo.org, repo: repo.name });
      await refreshOne(res.data);
    } catch (err) {
      console.error(err);
      return serverError(reply);
    }

    reply.status(200).send({
      success: true,
    });
  });
};
