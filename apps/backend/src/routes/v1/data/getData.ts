import { getActiveWeek, getOrInsert } from '../../../models/progress.js';
import { formatToYearWeek } from '../../../utils/date.js';

import type { APIGetData } from '../../../types/endpoint.js';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getData: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetData>('/data', async (_, reply) => {
    const weeks = await getActiveWeek();

    const dateWeek = formatToYearWeek(new Date());
    const progressPrevious = await getOrInsert({ date_week: weeks.currentWeek, type: 'analyze' });
    const progressCurrent = await getOrInsert({ date_week: dateWeek, type: 'analyze' });

    reply.status(200).send({
      success: true,
      data: {
        lastRefresh: progressCurrent.done ? progressCurrent.progress : progressPrevious.progress,
        inProgress: !progressCurrent.done,
      },
    });
  });
};
