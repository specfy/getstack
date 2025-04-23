import { listIndexed } from '@specfy/stack-analyser/dist/register';
import { CronJob } from 'cron';

import { analyze } from './analyzer';
import { getRepositoryToAnalyze, updateRepository } from '../models/repositories';
import { createTechnologies } from '../models/technologies';
import { formatToClickhouseDatetime, formatToYearWeek } from '../utils/date';
import { logger as defaultLogger } from '../utils/logger';
import { wait } from '../utils/wait';

import type { TechnologyInsert } from '../db/types';
import type { AllowedKeys, Payload } from '@specfy/stack-analyser';

const logger = defaultLogger.child({ svc: 'cron.analyze' });

// TODO: kill this on exit
export const cronAnalyzeGithubRepositories = CronJob.from({
  cronTime: '0 * * * *',
  start: true,
  onTick: async () => {
    logger.info('Starting analyze cron...');

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
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

        techs.delete('css');

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
  waitForCompletion: true,
});
