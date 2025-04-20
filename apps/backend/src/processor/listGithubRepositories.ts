import { Octokit } from '@octokit/rest';

import { batchUpsert } from '../models/repository';
import { logger } from '../utils/logger';

export interface RepositoryData {
  id: string;
  name: string;
  org: string;
  fullname: string;
  stars: number;
  url: string;
}

export async function listGithubRepositories(): Promise<RepositoryData[]> {
  const octokit = new Octokit();
  const repositories: RepositoryData[] = [];

  try {
    let page = 1;
    const perPage = 100; // GitHub API allows up to 100 items per page
    let hasMore = true;

    while (hasMore) {
      const { data } = await octokit.rest.search.repos({
        q: 'stars:>0',
        sort: 'stars',
        order: 'desc',
        per_page: perPage,
        page,
      });

      if (data.items.length === 0) {
        hasMore = false;
        break;
      }

      for (const repo of data.items) {
        const [org, name] = repo.full_name.split('/') as [string, string];
        repositories.push({
          id: repo.id.toString(),
          name,
          org,
          fullname: repo.full_name,
          stars: repo.stargazers_count,
          url: repo.html_url,
        });
      }

      page++;
      hasMore = data.items.length === perPage;
    }
  } catch (err) {
    logger.error('Error fetching repositories from GitHub:', err);
  }

  return repositories;
}

export async function batchUpsertRepositories(repositories: RepositoryData[]): Promise<void> {
  const batchSize = 1000;

  for (let i = 0; i < repositories.length; i += batchSize) {
    const batch = repositories.slice(i, i + batchSize);
    await batchUpsert(
      batch.map((repo) => {
        return {
          id: repo.id,
          name: repo.name,
          org: repo.org,
          stars: repo.stars,
          url: repo.url,
          last_fetched_at: null,
          created_at: new Date(),
          updated_at: new Date(),
        };
      })
    );
  }
}
