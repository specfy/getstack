import { getOrCache } from '../../../models/cache.js';
import { getTopLicensesOverTime } from '../../../models/licenses.js';
import { getAllLicensesNames } from '../../../models/licensesInfo.js';
import { getActiveWeek } from '../../../models/progress.js';

import type { APIGetLicenses, APILicenseTopN } from '../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getLicenses: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetLicenses>('/licenses', async (_, reply) => {
    const { currentWeek } = await getActiveWeek();
    const top = await getOrCache({
      keys: ['getLicenses', currentWeek],
      fn: () => getTopLicensesOverTime({ weeks: 10, currentWeek }),
    });

    const res = await getAllLicensesNames();
    const names = new Map<string, string>();
    for (const row of res) {
      names.set(row.key, row.full_name);
    }

    const data: APILicenseTopN[] = [];
    for (const row of top) {
      data.push({
        ...row,
        full_name: names.get(row.license)!,
      });
    }

    reply.status(200).send({
      success: true,
      data: { top: data },
    });
  });
};
