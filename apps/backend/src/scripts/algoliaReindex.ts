import { listAllRepositories } from '../models/repositories.js';
import { algolia } from '../utils/algolia.js';
import { envs } from '../utils/env.js';

import type { AlgoliaRepositoryObject } from '../types/algolia.js';

async function main(): Promise<void> {
  if (!envs.ALGOLIA_INDEX_NAME) {
    throw new Error('ALGOLIA_INDEX_NAME is not set in envs');
  }

  const repos = await listAllRepositories();
  console.log(`Found ${repos.length} repositories to reindex.`);

  const CHUNK_SIZE = 1000;
  let success = 0;
  let failed = 0;

  while (repos.length > 0) {
    const chunk = repos.splice(0, CHUNK_SIZE);
    const objects: AlgoliaRepositoryObject[] = chunk.map((repo) => ({
      objectID: repo.github_id,
      org: repo.org,
      name: repo.name,
      stars: repo.stars,
      description: repo.description || '',
      avatarUrl: repo.avatar_url || '',
    }));
    try {
      await algolia.saveObjects({
        indexName: envs.ALGOLIA_INDEX_NAME,
        objects: objects as unknown as Record<string, unknown>[],
      });
      success += objects.length;
      console.log(`Reindexed ${success} repositories...`);
    } catch (err: unknown) {
      failed += objects.length;
      console.error(`Failed to reindex chunk:`, err);
    }
  }

  console.log(`Done. Success: ${success}, Failed: ${failed}`);
}

await main();
