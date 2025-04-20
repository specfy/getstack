import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { FSProvider, analyser, flatten } from '@specfy/stack-analyser';
import degit from 'degit';

import { logger } from '../utils/logger';

import type { RepositoryRow } from '../db/types';
import type { Payload } from '@specfy/stack-analyser';

async function cloneRepository({
  fullName,
  dir,
}: {
  fullName: string;
  dir: string;
}): Promise<void> {
  try {
    logger.info(`Cloning repository ${fullName}`);

    const emitter = degit(`${fullName}`, {
      cache: true,
      force: true,
      verbose: true,
    });

    await emitter.clone(dir);
  } catch (err) {
    throw new Error(`Error cloning`, { cause: err });
  }
}

export async function analyze(repo: RepositoryRow): Promise<Payload> {
  const fullName = `${repo.org}/${repo.name}#${repo.branch}`;
  const dir = path.join(os.tmpdir(), 'stackhub', fullName);

  let dirCreated;
  try {
    await fs.mkdir(dir, { recursive: true });
    dirCreated = true;

    await cloneRepository({ fullName, dir });

    const stack = flatten(
      await analyser({
        provider: new FSProvider({
          path: dir,
          ignorePaths: [],
        }),
      })
    );

    return stack;
  } finally {
    if (dirCreated) {
      await fs.rmdir(dir);
    }
  }
}
