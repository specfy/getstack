import { CronJob } from 'cron';

import { listGithubRepositories } from './listGithubRepositories';
import { logger as defaultLogger } from '../utils/logger';

const logger = defaultLogger.child({ svc: 'cron.analyze' });

// TODO: kill this on exit
export const cronListGithubRepositories = CronJob.from({
  cronTime: '0 0 * * *',
  onTick: async () => {
    logger.info('Starting list cron...');

    await listGithubRepositories(logger);

    logger.info('✅ done');
  },
  waitForCompletion: true,
  start: true,
});
