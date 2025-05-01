import '@specfy/stack-analyser/dist/autoload.js';

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { FSProvider, analyser, flatten } from '@specfy/stack-analyser';
import { listIndexed } from '@specfy/stack-analyser/dist/common/techs.generated.js';
import degit from 'degit';

import { updateRepository } from '../models/repositories.js';
import { createTechnologies } from '../models/technologies.js';
import { formatToClickhouseDatetime, formatToYearWeek } from '../utils/date.js';

import type { RepositoryRow, TechnologyInsert } from '../db/types.js';
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
  try {
    const emitter = degit(`${fullName}#${branch}`, {
      mode: 'tar',
      cache: false,
      force: true,
      verbose: true,
    });

    await emitter.clone(dir);
  } catch (err) {
    console.error(err);
    throw new Error(`Error cloning`, { cause: err });
  }
}

export async function analyze(repo: RepositoryRow, logger: Logger): Promise<Payload> {
  const fullName = `${repo.org}/${repo.name}`;
  const dir = path.join(os.tmpdir(), 'stackhub', repo.org, repo.name);

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
  repo,
  res,
}: {
  repo: RepositoryRow;
  res: Payload;
}): Promise<void> {
  const techs = new Set<AllowedKeys>(res.techs);

  for (const child of res.childs) {
    for (const tech of child.techs) {
      techs.add(tech);
    }
  }

  const dateWeek = formatToYearWeek(new Date());

  const rows: TechnologyInsert[] = [];
  for (const tech of techs) {
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

  await updateRepository(repo.id, {
    last_fetched_at: formatToClickhouseDatetime(new Date()),
  });
}
