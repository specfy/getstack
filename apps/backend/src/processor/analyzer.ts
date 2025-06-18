import '@specfy/stack-analyser/dist/autoload.js';

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { FSProvider, analyser, flatten } from '@specfy/stack-analyser';
import { listIndexed } from '@specfy/stack-analyser/dist/common/techs.generated.js';
import { $ } from 'execa';

import { createLicenses, getLicensesByRepo } from '../models/licenses.js';
import { getActiveWeek } from '../models/progress.js';
import { updateRepository } from '../models/repositories.js';
import { createTechnologies, getTechnologiesByRepo } from '../models/technologies.js';
import { formatToClickhouseDatetime } from '../utils/date.js';
import { envs } from '../utils/env.js';
import { octokit } from '../utils/github.js';

import type {
  LicenseInsert,
  LicenseRow,
  TechnologyInsert,
  TechnologyRow,
} from '../db/types.clickhouse.js';
import type { RepositoryRow, TX } from '../db/types.db.js';
import type { AllowedLicensesLowercase } from '../types/stack.js';
import type { AllowedKeys, Payload } from '@specfy/stack-analyser';
import type { Logger } from 'pino';

async function cloneRepository({
  fullName,
  branch,
  dir,
}: {
  fullName: string;
  branch: string;
  dir: string;
}): Promise<void> {
  const res =
    await $`git clone --branch ${branch} https://github.com/${fullName}.git --depth 2 ${dir}`;

  if (res.exitCode !== 0) {
    console.error(res.stderr);
    throw new Error(`Error cloning`, { cause: res.stderr });
  }
}

export async function getPreviousAnalyzeIfStale(
  repo: RepositoryRow
): Promise<{ techs: TechnologyRow[]; licenses: LicenseRow[] } | false> {
  const githubInfo = await octokit.rest.repos.get({ owner: repo.org, repo: repo.name });

  const lastAnalyzedAt = new Date(repo.last_analyzed_at).getTime();
  const pushedRecently =
    new Date(githubInfo.data.pushed_at).getTime() > new Date(repo.last_fetched_at).getTime();
  const analyzedRecently = lastAnalyzedAt > Date.now() - 86_400 * 30 * 1000;

  if (pushedRecently) {
    return false;
  }
  if (!analyzedRecently) {
    return false;
  }
  if (envs.ANALYZE_REDO_BEFORE.getTime() > lastAnalyzedAt) {
    return false;
  }

  const { currentWeek } = await getActiveWeek();
  const techs = await getTechnologiesByRepo(repo, currentWeek);
  const licenses = await getLicensesByRepo(repo, currentWeek);
  return { techs, licenses };
}

export async function analyze(repo: RepositoryRow, logger: Logger): Promise<Payload> {
  const fullName = `${repo.org}/${repo.name}`;
  const dir = path.join(os.tmpdir(), 'getstack', repo.org, repo.name);

  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // Do nothing
  }

  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    throw new Error('Failed to create dir', { cause: err });
  }

  try {
    logger.info(`Cloning repository to ${dir}`);

    await cloneRepository({ fullName, dir, branch: repo.branch });

    logger.info(`Analyzing`);

    const payload = await analyser({
      provider: new FSProvider({
        path: dir,
      }),
    });
    const stack = flatten(payload, { merge: true });

    return stack;
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
}

export async function saveAnalysis({
  trx,
  repo,
  res,
  dateWeek,
}: {
  trx: TX;
  repo: RepositoryRow;
  res: Payload;
  dateWeek: string;
}): Promise<void> {
  const techs = new Set<AllowedKeys>(res.techs);

  for (const child of res.childs) {
    for (const tech of child.techs) {
      techs.add(tech);
    }
  }

  const rows: TechnologyInsert[] = [];
  for (const tech of techs) {
    if (tech === 'github') {
      // Too noisy
      continue;
    }

    rows.push({
      date_week: dateWeek,
      org: repo.org,
      name: repo.name,
      category: listIndexed[tech].type,
      tech,
    });
  }

  if (rows.length > 0) {
    await createTechnologies(rows);
  }

  if (res.licenses.size > 0) {
    const licenses: LicenseInsert[] = [];
    for (const license of res.licenses.values()) {
      if (license.startsWith('LicenseRef-')) {
        continue;
      }
      licenses.push({
        date_week: dateWeek,
        org: repo.org,
        name: repo.name,
        license: license.toLocaleLowerCase() as AllowedLicensesLowercase,
      });
    }
    await createLicenses(licenses);
  }

  await updateRepository({
    trx,
    id: repo.id,
    input: {
      last_fetched_at: formatToClickhouseDatetime(new Date()),
      last_analyzed_at: formatToClickhouseDatetime(new Date()),
    },
  });
}

export async function savePreviousIfStale({
  trx,
  repo,
  dateWeek,
}: {
  trx: TX;
  repo: RepositoryRow;
  dateWeek: string;
}): Promise<boolean> {
  const previous = await getPreviousAnalyzeIfStale(repo);
  if (previous === false) {
    return false;
  }

  if (previous.techs.length > 0) {
    await createTechnologies(
      previous.techs.map((row) => {
        return { ...row, date_week: dateWeek };
      })
    );
  }
  if (previous.licenses.length > 0) {
    await createLicenses(
      previous.licenses.map((row) => {
        return { ...row, date_week: dateWeek };
      })
    );
  }

  await updateRepository({
    trx,
    id: repo.id,
    input: {
      last_fetched_at: formatToClickhouseDatetime(new Date()),
    },
  });
  return true;
}
