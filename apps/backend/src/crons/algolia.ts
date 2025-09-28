import { CronJob } from 'cron';

import { reindexRepositoriesToAlgolia } from '../models/repositories.js';
import { defaultLogger } from '../utils/logger.js';

const logger = defaultLogger.child({ svc: 'cron.algolia' });

export const cronAlgolia = CronJob.from({
  cronTime: '15 12 * * *',
  waitForCompletion: true,
  start: true,
  onTick: async () => {
    await reindexRepositoriesToAlgolia(logger);
  },
});
