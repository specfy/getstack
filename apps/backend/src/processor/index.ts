import { listIndexed } from '@specfy/stack-analyser/dist/register';

import { analyze } from './analyzer';
import { listGithubRepositories } from './listGithubRepositories';
import { getRepositoryToAnalyze, updateRepository } from '../models/repositories';
import { createTechnologies } from '../models/technologies';
import { formatToClickhouseDatetime, formatToYearWeek } from '../utils/date';
import { logger } from '../utils/logger';
import { wait } from '../utils/wait';

import type { TechnologyInsert } from '../db/types';
import type { AllowedKeys, Payload } from '@specfy/stack-analyser';

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
    beforeDate.setDate(beforeDate.getDate() - 6);

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

      await updateRepository(repo.id, { last_fetched_at: formatToClickhouseDatetime(new Date()) });

      logger.info(`Done`);
    } catch (err) {
      logger.error(`Failed to save`, err);
      await updateRepository(repo.id, { errored: 1 });
    }

    await wait(1000);
  }
}
