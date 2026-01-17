import { Octokit } from 'octokit';

import { envs } from './env.js';

import type { RepositoryInsert } from '../db/types.db.js';
import type { RestEndpointMethodTypes } from '@octokit/rest';

export const octokit: Octokit = new Octokit({
  auth: envs.GITHUB_TOKEN,
});

export function fixGithubHomepageUrl(hp?: null | string): string {
  if (!hp) {
    return '';
  }
  return hp.startsWith('https:/') ? hp : `https://${hp}`;
}

export function githubToRepo(
  repo:
    | RestEndpointMethodTypes['repos']['get']['response']['data']
    | RestEndpointMethodTypes['search']['repos']['response']['data']['items'][0],
  filtered: false | string
): RepositoryInsert {
  const [org, name] = repo.full_name.split('/') as [string, string];
  return {
    github_id: String(repo.id),
    org,
    name,
    branch: repo.default_branch,
    stars: repo.stargazers_count,
    url: repo.html_url,
    ignored: filtered === false ? 0 : 1,
    ignored_reason: filtered === false ? 'ok' : filtered,
    errored: 0,
    last_fetched_at: new Date('1970-01-01T00:00:00.000'),
    last_analyzed_at: new Date(),
    size: repo.size,
    avatar_url: repo.owner?.avatar_url || '',
    homepage_url: fixGithubHomepageUrl(repo.homepage),
    description: repo.description || '',
    forks: repo.forks_count,
    repo_created_at: new Date(repo.created_at),
    private: repo.private,
  };
}
