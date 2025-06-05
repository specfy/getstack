import type { AllowedKeys, TechType } from '@specfy/stack-analyser';
import type { AllowedLicenses } from '@specfy/stack-analyser/dist/types/licenses.js';
import type { ColumnType, Insertable, Selectable, Transaction, Updateable } from 'kysely';

export type TimestampClickhouse = ColumnType<string, Date, Date | string>;
export type Timestamp = ColumnType<Date, Date, Date | string>;
export type CreatedAt = ColumnType<string, Date | undefined, never>;
export type UpdatedAt = ColumnType<string, Date | undefined, Date>;
export type BooleanDefault = ColumnType<boolean, boolean | undefined>;

export interface RepositoriesClickhouse {
  id: ColumnType<string, never, never>;
  org: string;
  name: string;
  stars: number;
  updated_at: CreatedAt;
}

export type ClickhouseRepositoryRow = Selectable<RepositoriesClickhouse>;
export type ClickhouseRepositoryInsert = Insertable<RepositoriesClickhouse>;
export type ClickhouseRepositoryUpdate = Updateable<RepositoriesClickhouse>;

export interface TechnologiesTable {
  org: string;
  name: string;
  tech: AllowedKeys;
  category: TechType;
  date_week: string;
}

export type TechnologyRow = Selectable<TechnologiesTable>;
export type TechnologyInsert = Insertable<TechnologiesTable>;
export type TechnologyUpdate = Updateable<TechnologiesTable>;

export interface TechnologiesWeeklyTable {
  date_week: string;
  category: TechType;
  tech: AllowedKeys;
  hits: number;
}
export type TechnologyWeeklyRow = Selectable<TechnologiesWeeklyTable>;

export interface LicensesTable {
  org: string;
  name: string;
  license: AllowedLicenses;
  date_week: string;
}
export type LicenseRow = Selectable<LicensesTable>;
export type LicenseInsert = Insertable<LicensesTable>;
export type LicenseUpdate = Updateable<LicensesTable>;

export interface LicensesWeeklyTable {
  date_week: string;
  license: AllowedLicenses;
  hits: number;
}
export type LicensesWeeklyRow = Selectable<LicensesWeeklyTable>;

export interface Clickhouse {
  // repositories: RepositoriesTable;
  repositories2: RepositoriesClickhouse;
  technologies: TechnologiesTable;
  technologies_weekly: TechnologiesWeeklyTable;
  licenses: LicensesTable;
  licenses_weekly: LicensesWeeklyRow;
}

// --------
// --- Postgres

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
  id: number;
  key: string;
  description: string;
  full_name: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
}
export type LicensesInfoTableRow = Selectable<LicensesInfoTable>;

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
