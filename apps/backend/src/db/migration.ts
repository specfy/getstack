import { promises as fs } from 'node:fs';
import path from 'node:path';

import { FileMigrationProvider, Migrator } from 'kysely';

import { db } from './index.js';

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, './migrations'),
  }),
});

export async function migrate(): Promise<boolean> {
  const { error, results } = await migrator.migrateToLatest();
  if (error !== undefined) {
    console.error('failed to migrate');
    console.error(error);
    return false;
  }

  if (results) {
    for (const it of results) {
      if (it.status === 'Success') {
        console.log(`migration "${it.migrationName}" was executed successfully`);
      } else if (it.status === 'Error') {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    }
  }

  return true;
}
