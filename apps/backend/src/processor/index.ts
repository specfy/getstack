import { analyze } from './analyzer';
import { listGithubRepositories } from './listGithubRepositories';
import { getRepositoryToAnalyze } from '../models/repository';
import { logger } from '../utils/logger';

export async function cronListGithubRepositories(): Promise<void> {
  logger.info('Starting cron...');
  await listGithubRepositories();

  logger.info('✅ done');
}

export async function cronAnalyzeGithubRepositories(): Promise<void> {
  const beforeDate = new Date();
  beforeDate.setDate(beforeDate.getDate() - 0);

  const repo = await getRepositoryToAnalyze({ beforeDate });
  if (!repo) {
    return;
  }

  logger.info(`Analyzing ${repo.url}`);

  try {
    const res = await analyze(repo);
    // console.dir(res.childs.map((child) => child.tech).filter(Boolean), { depth: 1 });
    console.log([...new Set(res.childs.flatMap((child) => [...child.techs.values()]))]);
  } catch (err) {
    logger.error(`Failed to analyze`, err);
  }
}
