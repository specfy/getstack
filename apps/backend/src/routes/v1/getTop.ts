import { getTopTechnologiesWithTrend } from '../../models/technologies';

import type { APIGetTop, TechnologyByCategoryByWeekWithTrend } from '../../types/endpoint';
import type { TechType } from '@specfy/stack-analyser';
import type { FastifyInstance, FastifyPluginCallback } from 'fastify';

export const getTopRoute: FastifyPluginCallback = (fastify: FastifyInstance) => {
  fastify.get<APIGetTop>('/top', async (_, reply) => {
    const data = await getTopTechnologiesWithTrend();

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
