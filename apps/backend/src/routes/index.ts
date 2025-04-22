import { getTopRoute } from './v1/getTop';

import type { FastifyPluginAsync } from 'fastify';

export const routes: FastifyPluginAsync = async (f) => {
  await f.register(getTopRoute, { prefix: '/1' });
};
