import { getOrCache } from '../../../models/cache.js';
import { getLicensesLeaderboard } from '../../../models/licenses.js';
import { getAllLicensesNames } from '../../../models/licensesInfo.js';
import { getActiveWeek } from '../../../models/progress.js';

import type { APIGetLicensesLeaderboard, APILicenseLeaderboard } from '../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getLicenseLeaderboard: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetLicensesLeaderboard>('/licenses/leaderboard', async (_, reply) => {
    const weeks = await getActiveWeek();
    const data = await getOrCache({
      keys: ['getLicensesLeaderboard', weeks.currentWeek, weeks.previousWeek],
      fn: () => getLicensesLeaderboard({ ...weeks }),
    });

    const res = await getAllLicensesNames();
    const names = new Map<string, string>();
    for (const row of res) {
      names.set(row.key, row.full_name);
    }

    const leaderboard: APILicenseLeaderboard[] = [];
    for (const row of data) {
      leaderboard.push({
        ...row,
        full_name: names.get(row.license)!,
      });
    }

    reply.status(200).send({
      success: true,
      data: leaderboard,
    });
  });
};
