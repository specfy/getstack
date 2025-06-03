import { listTech } from '@specfy/stack-analyser/dist/common/techs.generated.js';

import { defaultLogger } from '../utils/logger.js';
import { wait } from '../utils/wait.js';

import type { TechType } from '@specfy/stack-analyser';

const logger = defaultLogger.child({
  script: 'cache',
});

const API_URL = 'http://localhost:3000/1';

const ALL_TECH_TYPES: Record<TechType, null> = {
  ai: null,
  analytics: null,
  api: null,
  app: null,
  auth: null,
  automation: null,
  ci: null,
  cloud: null,
  cms: null,
  collaboration: null,
  communication: null,
  crm: null,
  db: null,
  etl: null,
  framework: null,
  hosting: null,
  iac: null,
  language: null,
  linter: null,
  maps: null,
  messaging: null,
  monitoring: null,
  network: null,
  notification: null,
  orm: null,
  package_manager: null,
  payment: null,
  queue: null,
  runtime: null,
  saas: null,
  security: null,
  storage: null,
  test: null,
  tool: null,
  ui_framework: null,
  ui: null,
};

// ---
// Categories
// ---
for (const category of Object.keys(ALL_TECH_TYPES) as TechType[]) {
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
