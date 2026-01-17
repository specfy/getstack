import { promises as fs } from 'node:fs';
import path from 'node:path';

import { FileMigrationProvider, Migrator } from 'kysely';

import { db, kyselyClickhouse } from './client.js';
import { algolia } from '../utils/algolia.js';
import { envs } from '../utils/env.js';
import { defaultLogger as logger, logError } from '../utils/logger.js';

import type { IndexSettings } from 'algoliasearch';

const migratorDB = new Migrator({
  db: db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, './migrationsDb'),
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
      logError(new Error('failed to migrate DN'), error);
      return false;
    }

    if (results) {
      for (const it of results) {
        if (it.status === 'Success') {
          logger.info(`migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
          logError(new Error(`failed to execute migration "${it.migrationName}"`));
        }
      }
    }
    logger.info('DB migrated');
  }

  {
    const { error, results } = await migratorClickhouse.migrateToLatest();
    if (error !== undefined) {
      logError(new Error('failed to migrate ClickHouse'), error);
      return false;
    }

    if (results) {
      for (const it of results) {
        if (it.status === 'Success') {
          logger.info(`migration "${it.migrationName}" was executed successfully`);
        } else if (it.status === 'Error') {
          logError(new Error(`failed to execute migration "${it.migrationName}"`));
        }
      }
    }
    logger.info('ClickHouse migrated');
  }

  {
    if (envs.ALGOLIA_INDEX_NAME && envs.ALGOLIA_API_KEY && envs.ALGOLIA_APP_ID) {
      const indexName = envs.ALGOLIA_INDEX_NAME;
      const settings: IndexSettings = {
        minWordSizefor1Typo: 4,
        minWordSizefor2Typos: 8,
        hitsPerPage: 20,
        maxValuesPerFacet: 100,
        searchableAttributes: ['unordered(org)', 'unordered(name)'],
        optionalWords: null,
        paginationLimitedTo: 1000,
        exactOnSingleWordQuery: 'attribute',
        ranking: [
          'exact',
          'desc(stars)',
          'typo',
          'geo',
          'words',
          'filters',
          'proximity',
          'attribute',
          'custom',
        ],
        separatorsToIndex: '',
        removeWordsIfNoResults: 'none',
        queryType: 'prefixLast',
        highlightPreTag: '<em>',
        highlightPostTag: '</em>',
        alternativesAsExact: ['ignorePlurals', 'singleWordSynonym'],
      };
      // const exists = await algolia.indexExists({ indexName });
      await algolia.setSettings({ indexName, indexSettings: settings });

      logger.info('Algolia migrated');
    }
  }

  return true;
}
