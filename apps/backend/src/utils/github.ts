import { Octokit } from 'octokit';

import { envs } from './env.js';

export const octokit: Octokit = new Octokit({
  auth: envs.GITHUB_TOKEN,
});
