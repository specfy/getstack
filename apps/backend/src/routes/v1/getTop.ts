import { getOrCache } from '../../models/cache.js';
import { getActiveWeek } from '../../models/progress.js';
import { getTopTechnologiesWithTrend } from '../../models/technologies.js';

import type { APIGetTop, TechnologyByCategoryByWeekWithTrend } from '../../types/endpoint.js';
import type { TechType } from '@specfy/stack-analyser';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getTopRoute: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetTop>('/top', async (_, reply) => {
    const weeks = await getActiveWeek();
    const data = await getOrCache({
      keys: ['getTopTechnologiesWithTrend', weeks.currentWeek, weeks.previousWeek],
      fn: () => getTopTechnologiesWithTrend(weeks),
    });

    const group: Record<string, TechnologyByCategoryByWeekWithTrend[]> = {};
    for (const item of data) {
      if (group[item.category] === undefined) {
        group[item.category] = [];
      }
      group[item.category]!.push(item);
    }

    reply.status(200).send({
      success: true,
      data: Object.entries(group).map((entry) => {
        return { category: entry[0] as TechType, rows: entry[1] };
      }),
    });
  });
};
