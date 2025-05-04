import { CronJob } from 'cron';

import { getOrInsert, update } from '../models/progress.js';
import { upsertRepository } from '../models/repositories.js';
import { formatToClickhouseDatetime, formatToDate, formatToYearWeek } from '../utils/date.js';
import { envs } from '../utils/env.js';
import { octokit } from '../utils/github.js';
import { defaultLogger } from '../utils/logger.js';
import { wait } from '../utils/wait.js';

import type { RestEndpointMethodTypes } from '@octokit/rest';

const logger = defaultLogger.child({ svc: 'cron.list' });

const MIN_STARS = 1000;
const PER_PAGE = 100;
const MIN_YEAR = 2;

// TODO: kill this on exit
export const cronListGithubRepositories = CronJob.from({
  cronTime: '*/10 * * * *',
  waitForCompletion: true,
  start: envs.CRON_LIST,
  onTick: async () => {
    const dateWeek = formatToYearWeek(new Date());
    const progress = await getOrInsert({ date_week: dateWeek, type: 'list' });
    if (progress.done) {
      logger.info('Already done...');
      return;
    }

    logger.info('Starting list cron...');

    const end = Date.now() + 9 * 60 * 1000;

    const startDate = new Date(progress.progress);
    const endDate = new Date('2008-01-01');
    let currentDate = new Date(startDate);
    try {
      while (currentDate >= endDate && Date.now() < end) {
        const nextDate = new Date(currentDate);
        nextDate.setDate(currentDate.getDate() - 1);
        const dateString = formatToDate(nextDate);
        logger.info({ currentDate, nextDate }, 'Searching repositories');

        await fetchOneDay(dateString);

        currentDate = nextDate;

        await update({
          date_week: dateWeek,
          progress: nextDate.toISOString(),
          done: false,
          type: 'list',
        });
      }
    } catch (err) {
      logger.error('Error fetching repositories from GitHub:', err);
    }

    if (currentDate.getTime() <= endDate.getTime()) {
      await update({
        date_week: dateWeek,
        progress: endDate.toISOString(),
        done: true,
        type: 'list',
      });
    }
    logger.info('✅ done');
  },
});

async function fetchOneDay(dateString: string): Promise<void> {
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

      const [org, name] = repo.full_name.split('/') as [string, string];
      const filtered = filter(repo);
      await upsertRepository({
        github_id: String(repo.id),
        org,
        name,
        branch: repo.default_branch,
        stars: repo.stargazers_count,
        url: repo.html_url,
        ignored: filtered === false ? 0 : 1,
        ignored_reason: filtered === false ? 'ok' : filtered,
        errored: 0,
        last_fetched_at: formatToClickhouseDatetime(new Date('1970-01-01T00:00:00.000')),
        size: repo.size,
      });
    }

    hasMore = data.items.length === PER_PAGE;
    page++;
    await wait(1000);
  }
}

const oneGb = 1_000_000;
function filter(
  repo: RestEndpointMethodTypes['search']['repos']['response']['data']['items'][0]
): false | string {
  const nameLower = repo.name.toLocaleLowerCase();
  if (denylistName.some((deny) => nameLower.includes(deny))) {
    return 'deny';
  }
  if (repo.stargazers_count <= MIN_STARS) {
    return 'not_popular';
  }
  if (repo.private) {
    return 'private';
  }
  if (repo.fork) {
    return 'fork';
  }
  if (repo.archived) {
    return 'archived';
  }
  if (repo.is_template) {
    return 'template';
  }
  if (repo.size >= oneGb) {
    return 'too_big';
  }

  const dateThreshold = new Date();
  dateThreshold.setFullYear(dateThreshold.getFullYear() - MIN_YEAR);
  if (new Date(repo.pushed_at).getTime() < dateThreshold.getTime()) {
    return 'too_old';
  }

  return false;
}

const denylistName = [
  'awesome',
  '-notes',
  'bootcamp',
  'challenge',
  'zoomcamp',
  'tutorial',
  'cheatsheet',
  'interview-questions',
  'guidelines',
  '-guide',
  '100-days',
  '101',
  'questions',
  '-course',
  'exercises',
  'interview',
  'playbook',
  'practice',
  'cookbook',
  'leetcode',
  'collection',
  'sample',
  'dataset',
  'boilerplate',
  '-for',
  '-demo',
  '-to-',
  '-should-',
  'free-',
  'patterns',
  'checklist',
  'roadmap',
  'codecamp',
  'learn-',
  'handbook',
  'cheat-sheet',
  'resources',
  'examples',
  '-templates',
  '-tips',
  '-tricks',
  'chinese',
];
