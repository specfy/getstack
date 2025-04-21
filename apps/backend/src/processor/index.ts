import { analyze } from './analyzer';
import { listGithubRepositories } from './listGithubRepositories';
import { formatToClickhouseDatetime } from '../db/utils';
import { getRepositoryToAnalyze, updateRepository } from '../models/repositories';
import { createTechnologies } from '../models/technologies';
import { logger } from '../utils/logger';
import { wait } from '../utils/wait';

import type { TechnologyInsert } from '../db/types';
import type { Payload } from '@specfy/stack-analyser';

export async function cronListGithubRepositories(): Promise<void> {
  if ('true' === 'true') {
    return;
  }

  logger.info('Starting cron...');

  await listGithubRepositories();

  logger.info('✅ done');
}

export async function cronAnalyzeGithubRepositories(): Promise<void> {
  while (true) {
    const beforeDate = new Date();
    beforeDate.setDate(beforeDate.getDate() - 0);

    const repo = await getRepositoryToAnalyze({ beforeDate });
    if (!repo) {
      break;
    }

    logger.info(`Processing ${repo.url}`);

    let res: Payload;
    try {
      res = await analyze(repo);
    } catch (err) {
      logger.error(`Failed to analyze`, err);
      await updateRepository(repo.id, { errored: true });
      continue;
    }

    try {
      const techs = [...new Set(res.childs.flatMap((child) => [...child.techs.values()]))];

      const dateWeek = new Date();
      dateWeek.setDate(dateWeek.getDate() - dateWeek.getDay()); // Round to the nearest week start

      const rows: TechnologyInsert[] = techs.map((tech) => {
        return {
          date_week: dateWeek.toISOString().split('T')[0] as unknown as Date,
          org: repo.org,
          name: repo.name,
          tech,
        };
      });
      if (rows.length > 0) {
        await createTechnologies(rows);
      } else {
        logger.info('Nothing to save');
      }

      await updateRepository(repo.id, { last_fetched_at: formatToClickhouseDatetime(new Date()) });

      logger.info(`Done`);
    } catch (err) {
      logger.error(`Failed to save`, err);
      await updateRepository(repo.id, { errored: true });
    }

    await wait(1000);
  }
}
