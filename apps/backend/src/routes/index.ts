import { postCronTriggerList } from './v1/cron/postTriggerList.js';
import { getRoot } from './v1/getRoot.js';
import { getTopRoute } from './v1/getTop.js';
import { postAnalyzeOne } from './v1/repository/postAnalyzeOne.js';

import type { FastifyPluginAsync } from 'fastify';

export const routes: FastifyPluginAsync = async (f) => {
  await f.register(postAnalyzeOne, { prefix: '/1' });

  await f.register(getTopRoute, { prefix: '/1' });
  await f.register(postCronTriggerList, { prefix: '/1' });
  await f.register(getRoot, { prefix: '/1' });
  await f.register(getRoot, { prefix: '/' });
};
