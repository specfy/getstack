import { promises as fs } from 'node:fs';
import path from 'node:path';

import { FileMigrationProvider, Migrator } from 'kysely';

import { db } from './client.js';
import { logger } from '../utils/logger.js';

const migrator = new Migrator({
  db: db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, './migrations'),
  }),
});

export async function migrate(): Promise<boolean> {
  const { error, results } = await migrator.migrateToLatest();
  if (error !== undefined) {
    logger.error('failed to migrate');
    logger.error(error);
    return false;
  }

  if (results) {
    for (const it of results) {
      if (it.status === 'Success') {
        logger.info(`migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === 'Error') {
        logger.error(`failed to execute migration "${it.migrationName}"`);
      }
    }
  }

  return true;
}
