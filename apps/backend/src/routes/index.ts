import { getCategory } from './v1/categories/$name/getCategory.js';
import { getCategoryLeaderboard } from './v1/categories/$name/leaderboard/getLeaderboard.js';
import { postCronTriggerAnalyze } from './v1/cron/postTriggerAnalyze.js';
import { postCronTriggerList } from './v1/cron/postTriggerList.js';
import { getData } from './v1/data/getData.js';
import { getRoot } from './v1/getRoot.js';
import { getTopRoute } from './v1/getTop.js';
import { getApiLicense } from './v1/licenses/$license/getLicense.js';
import { getLicenseLeaderboard } from './v1/licenses/getLeaderboard.js';
import { getLicenses } from './v1/licenses/getLicenses.js';
import { postSubscribe } from './v1/newsletter/postSubscribe.js';
import { getPost } from './v1/posts/$id/getPost.js';
import { getPosts } from './v1/posts/getPosts.js';
import { getRepositoryImage } from './v1/repositories/$org/$name/getImage.js';
import { getApiRepository } from './v1/repositories/$org/$name/getRepository.js';
import { postAnalyzeOne } from './v1/repositories/$org/$name/postAnalyzeOne.js';
import { postRefreshOne } from './v1/repositories/$org/$name/postRefresh.js';
import { getTechnology } from './v1/technologies/$name/getTechnology.js';
import { getTechnologyRelated } from './v1/technologies/$name/related/getRelated.js';

import type { FastifyPluginAsync } from 'fastify';

export const routes: FastifyPluginAsync = async (f) => {
  await f.register(postAnalyzeOne, { prefix: '/1' });
  await f.register(postRefreshOne, { prefix: '/1' });
  await f.register(getTechnology, { prefix: '/1' });
  await f.register(getTechnologyRelated, { prefix: '/1' });
  await f.register(getApiRepository, { prefix: '/1' });
  await f.register(postSubscribe, { prefix: '/1' });
  await f.register(getRepositoryImage, { prefix: '/1' });
  await f.register(getLicenses, { prefix: '/1' });
  await f.register(getLicenseLeaderboard, { prefix: '/1' });
  await f.register(getApiLicense, { prefix: '/1' });
  await f.register(getData, { prefix: '/1' });
  await f.register(getPosts, { prefix: '/1' });
  await f.register(getPost, { prefix: '/1' });

  await f.register(getCategory, { prefix: '/1' });
  await f.register(getCategoryLeaderboard, { prefix: '/1' });
  await f.register(getTopRoute, { prefix: '/1' });
  await f.register(postCronTriggerList, { prefix: '/1' });
  await f.register(postCronTriggerAnalyze, { prefix: '/1' });
  await f.register(getRoot, { prefix: '/1' });
  await f.register(getRoot, { prefix: '/' });
};
