import { listTech } from '@specfy/stack-analyser/dist/common/techs.generated.js';

import { listAllRepositories } from '../models/repositories.js';
import { defaultLogger } from '../utils/logger.js';
import { categories } from '../utils/stacks.js';
import { wait } from '../utils/wait.js';

function parseArg(name: string): boolean {
  return process.argv.some((a) => a.startsWith(`--${name}`));
}

const hasCategories = parseArg('categories');
const hasTechs = parseArg('techs');
const hasRepos = parseArg('repos');

const logger = defaultLogger.child({
  script: 'cache',
});

const API_URL = 'http://localhost:3000/1';

logger.info('Warmup cache...', { hasCategories, hasTechs, hasRepos });

// ---
// Categories
// ---
if (hasCategories) {
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
}

// ---
// Technologies
// ---
if (hasTechs) {
  let techCount = 0;
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
    techCount++;
    if (techCount % 100 === 0) {
      logger.info(`Tech progress: ${techCount}/${listTech.length}`);
    }
  }
}

// ---
// Repositories
// ---
if (hasRepos) {
  const repos = await listAllRepositories();
  let repoCount = 0;
  for (const repo of repos) {
    const url = `${API_URL}/repositories/${encodeURIComponent(repo.org)}/${encodeURIComponent(repo.name)}`;
    try {
      logger.info(`Repo: ${repo.org}/${repo.name}`);
      const res = await fetch(url);
      if (!res.ok) {
        logger.error(`Error: status ${res.status}`);
      }
    } catch (err) {
      logger.error(`Error:`, err);
    }
    await wait(100);
    repoCount++;
    if (repoCount % 100 === 0) {
      logger.info(`Repo progress: ${repoCount}/${repos.length}`);
    }
  }
}

logger.info('Cache warmup complete.');
