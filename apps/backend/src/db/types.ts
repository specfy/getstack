import type { AllowedKeys, TechType } from '@specfy/stack-analyser';
import type { AllowedLicenses } from '@specfy/stack-analyser/dist/types/licenses.js';
import type { ColumnType, Insertable, Selectable, Transaction, Updateable } from 'kysely';

export type Timestamp = ColumnType<string, Date, Date | string>;
export type CreatedAt = ColumnType<string, Date | undefined, never>;
export type UpdatedAt = ColumnType<string, Date | undefined, Date>;
export type BooleanDefault = ColumnType<boolean, boolean | undefined>;

export interface RepositoriesClickhouse {
  id: ColumnType<string, never, never>;
  org: string;
  name: string;
  stars: number;
  updated_at: Timestamp;
}
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
  repositories: RepositoriesTable;
  repositories2: RepositoriesClickhouse;
  technologies: TechnologiesTable;
  technologies_weekly: TechnologiesWeeklyTable;
  licenses: LicensesTable;
  licenses_weekly: LicensesWeeklyRow;
}

// --------
// --- Postgres

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
}
export type LicensesInfoTableRow = Selectable<LicensesInfoTable>;

export interface Database {
  progress: ProgressTable;
  licenses_info: LicensesInfoTable;
  repositories: RepositoriesTable;
}

export type TX = Transaction<Database>;
