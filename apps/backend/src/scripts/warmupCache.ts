import { listTech } from '@specfy/stack-analyser/dist/common/techs.generated.js';

import { defaultLogger } from '../utils/logger.js';
import { categories } from '../utils/stacks.js';
import { wait } from '../utils/wait.js';

const logger = defaultLogger.child({
  script: 'cache',
});

const API_URL = 'http://localhost:3000/1';

// ---
// Categories
// ---
for (const category of categories) {
  const url = `${API_URL}/categories/${encodeURIComponent(category)}`;
  try {
    logger.info(`Category: ${category}`);

    const res = await fetch(url);
    if (!res.ok) {
      logger.error(`Error: status ${res.status}`);
    }

    const resLeaderboard = await fetch(`${url}/leaderboard`);
    if (!resLeaderboard.ok) {
      logger.error(`Error leaderboard: status ${resLeaderboard.status}`);
    }
  } catch (err) {
    logger.error(`Error:`, err);
  }
  await wait(100);
}

// ---
// Technologies
// ---
for (const tech of listTech) {
  const url = `${API_URL}/technologies/${encodeURIComponent(tech.key)}`;
  try {
    logger.info(`Tech: ${tech.key}`);
    const res = await fetch(url);
    if (!res.ok) {
      logger.error(`Error: status ${res.status}`);
    }
    const resRelated = await fetch(`${url}/related`);
    if (!resRelated.ok) {
      logger.error(`Error related: status ${resRelated.status}`);
    }
  } catch (err) {
    logger.error(`Error:`, err);
  }
  await wait(100);
}

logger.info('Cache warmup complete.');
