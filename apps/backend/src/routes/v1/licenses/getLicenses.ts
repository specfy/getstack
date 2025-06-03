import { getOrCache } from '../../../models/cache.js';
import { getTopLicensesOverTime } from '../../../models/licenses.js';
import { getActiveWeek } from '../../../models/progress.js';

import type { APIGetLicenses } from '../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getLicenses: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetLicenses>('/licenses', async (_, reply) => {
    const { currentWeek } = await getActiveWeek();
    const top = await getOrCache({
      keys: ['getLicenses', currentWeek],
      fn: () => getTopLicensesOverTime({ weeks: 10, currentWeek }),
    });

    reply.status(200).send({
      success: true,
      data: { top },
    });
  });
};
