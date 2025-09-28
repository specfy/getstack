import { reindexRepositoriesToAlgolia } from '../models/repositories.js';

/**
 * npx tsx --env-file=.env apps/backend/src/scripts/algoliaReindex.ts
 */
await reindexRepositoriesToAlgolia();
