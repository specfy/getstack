import '@specfy/stack-analyser/dist/autoload.js';

import { listIndexed } from '@specfy/stack-analyser/dist/register.js';
import { CronJob } from 'cron';

import { analyze } from './analyzer.js';
import { getRepositoryToAnalyze, updateRepository } from '../models/repositories.js';
import { createTechnologies } from '../models/technologies.js';
import { formatToClickhouseDatetime, formatToYearWeek } from '../utils/date.js';
import { envs } from '../utils/env.js';
import { logger as defaultLogger } from '../utils/logger.js';
import { wait } from '../utils/wait.js';

import type { TechnologyInsert } from '../db/types.js';
import type { AllowedKeys, Payload } from '@specfy/stack-analyser';

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
        const techs = new Set<AllowedKeys>(res.techs);

        for (const child of res.childs) {
          for (const tech of child.techs) {
            techs.add(tech);
          }
        }

        const dateWeek = formatToYearWeek(new Date());

        const rows: TechnologyInsert[] = [];
        for (const tech of techs) {
          rows.push({
            date_week: dateWeek,
            org: repo.org,
            name: repo.name,
            category: listIndexed[tech].type,
            tech,
          });
        }

        if (rows.length > 0) {
          await createTechnologies(rows);
        } else {
          logger.info('Nothing to save');
        }

        await updateRepository(repo.id, {
          last_fetched_at: formatToClickhouseDatetime(new Date()),
        });

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
