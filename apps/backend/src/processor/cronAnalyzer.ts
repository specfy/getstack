import '@specfy/stack-analyser/dist/autoload.js';

import { CronJob } from 'cron';

import { analyze, saveAnalysis } from './analyzer.js';
import { getOrInsert, update } from '../models/progress.js';
import { getRepositoryToAnalyze, updateRepository } from '../models/repositories.js';
import { formatToYearWeek } from '../utils/date.js';
import { envs } from '../utils/env.js';
import { defaultLogger } from '../utils/logger.js';
import { wait } from '../utils/wait.js';

import type { Payload } from '@specfy/stack-analyser';

const logger = defaultLogger.child({ svc: 'cron.analyze' });

// TODO: kill this on exit
export const cronAnalyzeGithubRepositories = CronJob.from({
  cronTime: '*/10 * * * *',
  start: envs.CRON_ANALYZE,
  waitForCompletion: true,
  onTick: async () => {
    logger.info('Starting analyze cron...');
    const dateWeek = formatToYearWeek(new Date());
    const progress = await getOrInsert({ date_week: dateWeek, type: 'analyze' });
    if (progress.done) {
      logger.info('Already done...');
      return;
    }

    const end = Date.now() + 9 * 60 * 1000;

    const beforeDate = new Date(progress.progress);

    while (Date.now() < end) {
      const repo = await getRepositoryToAnalyze({ beforeDate });
      if (!repo) {
        await update({ ...progress, done: true });
        break;
      }

      logger.info(`Processing ${repo.url}`);

      let res: Payload;
      try {
        res = await analyze(repo, logger);
      } catch (err) {
        logger.error(err, `Failed to analyze`);
        await updateRepository(repo.id, { errored: 1 });
        await wait(1000);
        continue;
      }

      try {
        await saveAnalysis({ repo, res });
        logger.info(`Done`);
      } catch (err) {
        logger.error(err, `Failed to save`);
        await updateRepository(repo.id, { errored: 1 });
      }

      await wait(1000);
    }

    logger.info('✅ done');
  },
});
