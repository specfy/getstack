import '@specfy/stack-analyser/dist/autoload.js';

import { CronJob } from 'cron';

import { analyze, saveAnalysis, savePreviousIfStale } from './analyzer.js';
import { db } from '../db/client.js';
import { getOrInsert, update } from '../models/progress.js';
import { getRepositoryToAnalyze, updateRepository } from '../models/repositories.js';
import { formatToYearWeek } from '../utils/date.js';
import { envs } from '../utils/env.js';
import { defaultLogger, logError } from '../utils/logger.js';
import { wait } from '../utils/wait.js';

import type { Payload } from '@specfy/stack-analyser';

const logger = defaultLogger.child({ svc: 'cron.analyze' });

// TODO: kill this on exit
export const cronAnalyzeGithubRepositories = CronJob.from({
  cronTime: '*/10 * * * *',
  start: envs.CRON_ANALYZE,
  waitForCompletion: true,
  onTick: async () => {
    logger.info('Starting analyze cron...', { concurrency: envs.ANALYZE_CONCURRENCY });
    const dateWeek = formatToYearWeek(new Date());
    const progress = await getOrInsert({ date_week: dateWeek, type: 'analyze' });
    if (progress.done) {
      logger.info('Already done...');
      return;
    }

    const end = Date.now() + 9 * 60 * 1000;

    const beforeDate = new Date(progress.progress);

    for (let i = 0; i < envs.ANALYZE_CONCURRENCY; i++) {
      void (async () => {
        while (Date.now() < end) {
          const cont = await db.transaction().execute(async (trx) => {
            const repo = await getRepositoryToAnalyze({ trx, beforeDate });
            if (!repo) {
              await update(trx, { ...progress, done: true });
              return false;
            }

            logger.info(`[${i}] Processing ${repo.url}`);

            try {
              const withPrevious = await savePreviousIfStale({ trx, repo, dateWeek });
              if (withPrevious) {
                logger.info('No changes since last fetch');
                await wait(envs.ANALYZE_WAIT);
                return true;
              }
            } catch (err) {
              logError(new Error('Failed to get previous'), err);
            }

            let res: Payload;
            try {
              res = await analyze(repo, logger);
            } catch (err) {
              logError(new Error(`Failed to analyze`), err);
              await updateRepository({ trx, id: repo.id, input: { errored: 1 } });
              await wait(envs.ANALYZE_WAIT);
              return true;
            }

            try {
              await saveAnalysis({ trx, repo, res, dateWeek });
              logger.info(`Done`);
            } catch (err) {
              logError(new Error(`Failed to save`), err);
              await updateRepository({ trx, id: repo.id, input: { errored: 1 } });
            }

            await wait(envs.ANALYZE_WAIT);
            return true;
          });

          if (!cont) {
            break;
          }
        }
      })();
    }

    logger.info('✅ done');
  },
});
