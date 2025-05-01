import { promises as fs } from 'node:fs';
import path from 'node:path';

import { FileMigrationProvider, Migrator } from 'kysely';

import { db, kyselyClickhouse } from './client.js';
import { defaultLogger as logger } from '../utils/logger.js';

const migratorDB = new Migrator({
  db: db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, './migrationsDB'),
  }),
});
const migratorClickhouse = new Migrator({
  db: kyselyClickhouse,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, './migrationsClickhouse'),
  }),
});

export async function migrate(): Promise<boolean> {
  {
    const { error, results } = await migratorDB.migrateToLatest();
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
  }

  {
    const { error, results } = await migratorClickhouse.migrateToLatest();
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
  }

  return true;
}
