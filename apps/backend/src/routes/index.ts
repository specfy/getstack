import { getCategory } from './v1/categories/$name/getCategory.js';
import { getCategoryLeaderboard } from './v1/categories/$name/leaderboard/getLeaderboard.js';
import { postCronTriggerAnalyze } from './v1/cron/postTriggerAnalyze.js';
import { postCronTriggerList } from './v1/cron/postTriggerList.js';
import { getRoot } from './v1/getRoot.js';
import { getTopRoute } from './v1/getTop.js';
import { postSubscribe } from './v1/newsletter/postSubscribe.js';
import { getRepositoryImage } from './v1/repositories/$org/$name/getImage.js';
import { getApiRepository } from './v1/repositories/$org/$name/getRepository.js';
import { postAnalyzeOne } from './v1/repositories/$org/$name/postAnalyzeOne.js';
import { postRefreshOne } from './v1/repositories/$org/$name/postRefresh.js';
import { postSearchRepository } from './v1/repositories/postSearch.js';
import { getTechnology } from './v1/technologies/$name/getTechnology.js';
import { getTechnologyRelated } from './v1/technologies/$name/related/getRelated.js';

import type { FastifyPluginAsync } from 'fastify';

export const routes: FastifyPluginAsync = async (f) => {
  await f.register(postAnalyzeOne, { prefix: '/1' });
  await f.register(postRefreshOne, { prefix: '/1' });
  await f.register(getTechnology, { prefix: '/1' });
  await f.register(getTechnologyRelated, { prefix: '/1' });
  await f.register(getApiRepository, { prefix: '/1' });
  await f.register(postSearchRepository, { prefix: '/1' });
  await f.register(postSubscribe, { prefix: '/1' });
  await f.register(getRepositoryImage, { prefix: '/1' });

  await f.register(getCategory, { prefix: '/1' });
  await f.register(getCategoryLeaderboard, { prefix: '/1' });
  await f.register(getTopRoute, { prefix: '/1' });
  await f.register(postCronTriggerList, { prefix: '/1' });
  await f.register(postCronTriggerAnalyze, { prefix: '/1' });
  await f.register(getRoot, { prefix: '/1' });
  await f.register(getRoot, { prefix: '/' });
};
