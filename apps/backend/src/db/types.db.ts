import type { AllowedLicensesLowercase } from '../types/stack.js';
import type { ColumnType, Insertable, Selectable, Transaction, Updateable } from 'kysely';

export type Timestamp = ColumnType<Date, Date, Date | string>;
export type CreatedAt = ColumnType<string, Date | undefined, never>;
export type UpdatedAt = ColumnType<string, Date | undefined, Date>;
export type BooleanDefault = ColumnType<boolean, boolean | undefined>;

export interface RepositoriesTable {
  id: ColumnType<string, never, never>;
  github_id: string;
  org: string;
  name: string;
  branch: string;
  stars: number;
  url: string;
  ignored: number;
  ignored_reason: string;
  errored: number;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
  last_fetched_at: Timestamp;
  size: number;
  last_analyzed_at: Timestamp;
  avatar_url: string;
  homepage_url: string;
  description: string;
  forks: number;
  repo_created_at: Timestamp;
}

export type RepositoryRow = Selectable<RepositoriesTable>;
export type RepositoryInsert = Insertable<RepositoriesTable>;
export type RepositoryUpdate = Updateable<RepositoriesTable>;

export interface ProgressTable {
  date_week: string;
  progress: string;
  type: 'analyze' | 'list';
  done: boolean;
}
export type ProgressTableRow = Selectable<ProgressTable>;

export interface LicensesInfoTable {
  id: ColumnType<number, never, never>;
  key: AllowedLicensesLowercase;
  description: string;
  full_name: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
}
export type LicensesInfoTableRow = Selectable<LicensesInfoTable>;
export type LicensesInfoInsert = Insertable<LicensesInfoTable>;
export type LicensesInfoUpdate = Updateable<LicensesInfoTable>;

// Add cache table types
export interface CacheTable {
  key: string;
  value: string;
  expires_at: Timestamp;
}
export type CacheRow = Selectable<CacheTable>;
export type CacheInsert = Insertable<CacheTable>;
export type CacheUpdate = Updateable<CacheTable>;

export interface Database {
  progress: ProgressTable;
  licenses_info: LicensesInfoTable;
  repositories: RepositoriesTable;
  cache: CacheTable;
}

export type TX = Transaction<Database>;
