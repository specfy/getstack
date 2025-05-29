import { getLicensesLeaderboard } from '../../../models/licenses.js';
import { getActiveWeek } from '../../../models/progress.js';
import { getOrCache } from '../../../utils/cache.js';

import type { APIGetLicensesLeaderboard } from '../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getLicenseLeaderboard: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetLicensesLeaderboard>('/licenses/leaderboard', async (_, reply) => {
    const weeks = await getActiveWeek();
    const data = await getOrCache(
      ['getLicensesLeaderboard', weeks.currentWeek, weeks.previousWeek],
      () => getLicensesLeaderboard({ ...weeks })
    );

    reply.status(200).send({
      success: true,
      data: data,
    });
  });
};
