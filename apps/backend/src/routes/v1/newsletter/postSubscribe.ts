import * as z from 'zod';

import { serverError } from '../../../utils/apiErrors.js';
import { envs } from '../../../utils/env.js';

import type { APIPostSubscribe } from '../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

const bodyParams = z.object({
  email: z.string().email(),
});

export const postSubscribe: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.post<APIPostSubscribe>('/newsletter', async (req, reply) => {
    const valBody = bodyParams.safeParse(req.body);
    if (valBody.error) {
      return reply.status(400).send({ error: { code: '400_invalid_body', status: 400 } });
    }

    const body: APIPostSubscribe['Body'] = valBody.data;
    const url = new URL(
      `https://api.beehiiv.com/v2/publications/${envs.BEEHIIV_PUBLICATION_ID}/subscriptions`
    );

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${envs.BEEHIIV_API_KEY}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify({ email: body.email }),
      });

      const json = (await res.json()) as
        | { data: { status: string } }
        | { status: number; statusText: string; errors: unknown[] };
      if ('status' in json) {
        return reply.status(400).send({
          error: { code: '400_invalid_body', status: 400 },
        });
      }
      if (json.data.status === 'pending') {
        return reply.status(200).send({
          success: true,
          message: 'Thanks for subscribing, please check your email to validate.',
        });
      }

      return reply.status(200).send({
        success: true,
        message: 'Thanks for subscribing',
      });
    } catch (err) {
      console.error(err);
      return serverError(reply);
    }
  });
};
