import type { AllowedLicensesLowercase } from '../types/stack.js';
import type { AnalyserJson } from '@specfy/stack-analyser';
import type { ColumnType, Insertable, Kysely, Selectable, Transaction, Updateable } from 'kysely';

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
  private: boolean;
}

export type RepositoryRow = Selectable<RepositoriesTable>;
export type RepositoryInsert = Insertable<RepositoriesTable>;
export type RepositoryUpdate = Updateable<RepositoriesTable>;

export interface RepositoriesAnalysisTable {
  id: ColumnType<string, never, never>;
  repository_id: string;
  analysis: AnalyserJson;
  last_manual_at: Timestamp;
}

export type RepositoryAnalysisRow = Selectable<RepositoriesAnalysisTable>;
export type RepositoryAnalysisInsert = Insertable<RepositoriesAnalysisTable>;
export type RepositoryAnalysisUpdate = Updateable<RepositoriesAnalysisTable>;

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

export interface PostsTable {
  id: number;
  title: string;
  content: string;
  summary: string;
  techs: { data: string[] };
  categories: { data: string[] };
  metadata: {
    author: string;
    avatarUrl: string;
    authorUrl: string;
    slug: string;
    image: string;
    imageCover?: string | undefined;
  };
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type PostsRow = Selectable<PostsTable>;
export type PostsInsert = Insertable<PostsTable>;
export type PostsUpdate = Updateable<PostsTable>;

export interface Database {
  progress: ProgressTable;
  licenses_info: LicensesInfoTable;
  repositories: RepositoriesTable;
  repositories_analysis: RepositoriesAnalysisTable;
  cache: CacheTable;
  posts: PostsTable;
}

export type TX = Kysely<Database> | Transaction<Database>;
