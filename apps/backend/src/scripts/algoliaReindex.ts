import { reindexRepositoriesToAlgolia } from '../models/repositories.js';
import { defaultLogger } from '../utils/logger.js';

const logger = defaultLogger.child({ svc: 'algolia' });

/**
 * npx tsx --env-file=.env apps/backend/src/scripts/algoliaReindex.ts
 */
await reindexRepositoriesToAlgolia(logger);
