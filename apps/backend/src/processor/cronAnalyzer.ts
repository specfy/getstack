import '@specfy/stack-analyser/dist/autoload.js';

import { CronJob } from 'cron';

import { analyze, saveAnalysis } from './analyzer.js';
import { getRepositoryToAnalyze, updateRepository } from '../models/repositories.js';
import { envs } from '../utils/env.js';
import { defaultLogger } from '../utils/logger.js';
import { wait } from '../utils/wait.js';

import type { Payload } from '@specfy/stack-analyser';

const logger = defaultLogger.child({ svc: 'cron.analyze' });

// TODO: kill this on exit
export const cronAnalyzeGithubRepositories = CronJob.from({
  cronTime: '*/15 * * * *',
  start: envs.CRON_ANALYZE,
  waitForCompletion: true,
  onTick: async () => {
    logger.info('Starting analyze cron...');

    const end = Date.now() + 14 * 60 * 1000;

    while (Date.now() < end) {
      const beforeDate = new Date();
      beforeDate.setDate(beforeDate.getDate() - 6);

      const repo = await getRepositoryToAnalyze({ beforeDate });
      if (!repo) {
        break;
      }

      logger.info(`Processing ${repo.url}`);

      let res: Payload;
      try {
        res = await analyze(repo, logger);
      } catch (err) {
        logger.error(`Failed to analyze`, err);
        await updateRepository(repo.id, { errored: 1 });
        continue;
      }

      try {
        await saveAnalysis({ repo, res });
        logger.info(`Done`);
      } catch (err) {
        logger.error(`Failed to save`, err);
        await updateRepository(repo.id, { errored: 1 });
      }

      await wait(1000);
    }

    logger.info('✅ done');
  },
});
