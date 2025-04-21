import { Octokit } from '@octokit/rest';

import { formatToClickhouseDatetime } from '../db/utils.js';
import { upsertRepository } from '../models/repositories.js';
import { envs } from '../utils/env.js';
import { logger } from '../utils/logger.js';
import { wait } from '../utils/wait.js';

import type { RestEndpointMethodTypes } from '@octokit/rest';

const MIN_STARS = 1000;
const PER_PAGE = 100;

export async function listGithubRepositories(): Promise<void> {
  const octokit = new Octokit({
    auth: envs.GITHUB_TOKEN,
  });

  try {
    const startDate = new Date('2025-04-21');
    const endDate = new Date('2025-04-10');
    let currentDate = new Date(startDate);

    while (currentDate >= endDate) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() - 1);
      const dateString = nextDate.toISOString().split('T')[0];

      logger.info({ currentDate, nextDate }, 'Searching repositories');
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const query = `created:${dateString}..${dateString} stars:>${MIN_STARS}`;
        const response = await octokit.rest.search.repos({
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: PER_PAGE,
          page,
        });

        const { data, headers } = response;

        // Handle rate limit
        const remaining = Number.parseInt(headers['x-ratelimit-remaining'] || '1', 10);
        const reset = Number.parseInt(headers['x-ratelimit-reset'] || '0', 10);
        if (remaining === 0) {
          const waitTime = Math.max(reset * 1000 - Date.now(), 0);
          logger.warn(`Rate limit reached. Waiting for ${waitTime / 1000} seconds.`);
          await wait(waitTime);
        }

        for (const repo of data.items) {
          logger.info(`Processing ${repo.id} - ${repo.full_name}`);
          if (filter(repo)) {
            continue;
          }

          const [org, name] = repo.full_name.split('/') as [string, string];
          await upsertRepository({
            github_id: String(repo.id),
            org,
            name,
            branch: repo.default_branch,
            stars: repo.stargazers_count,
            url: repo.html_url,
            ignored: false,
            errored: false,
            last_fetched_at: formatToClickhouseDatetime(new Date('1970-01-01T00:00:00.000')),
            created_at: new Date(),
            updated_at: new Date(),
          });
        }

        hasMore = data.items.length === PER_PAGE;
        page++;
        await wait(1000);
      }

      currentDate = nextDate;
    }
  } catch (err) {
    logger.error('Error fetching repositories from GitHub:', err);
  }
}

function filter(
  repo: RestEndpointMethodTypes['search']['repos']['response']['data']['items'][0]
): boolean {
  if (repo.name.startsWith('awesome')) {
    return true;
  }
  if (repo.stargazers_count <= MIN_STARS) {
    return true;
  }
  if (repo.private) {
    return true;
  }
  if (repo.fork) {
    return true;
  }
  if (repo.archived) {
    return true;
  }
  if (repo.is_template) {
    return true;
  }

  return false;
}
