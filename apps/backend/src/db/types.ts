import type { ColumnType, Insertable, Selectable, Transaction, Updateable } from 'kysely';

export type Timestamp = ColumnType<Date, Date, Date | string>;
export type CreatedAt = ColumnType<Date, Date | undefined, never>;
export type UpdatedAt = ColumnType<Date, Date | undefined, Date>;
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
  errored: number;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
  last_fetched_at: Date;
}

export type RepositoryRow = Selectable<RepositoriesTable>;
export type RepositoryInsert = Insertable<RepositoriesTable>;
export type RepositoryUpdate = Updateable<RepositoriesTable>;

export interface TechnologiesTable {
  org: string;
  name: string;
  tech: string;
  category: string;
  date_week: string;
}

export type TechnologyRow = Selectable<TechnologiesTable>;
export type TechnologyInsert = Insertable<TechnologiesTable>;
export type TechnologyUpdate = Updateable<TechnologiesTable>;

export interface TechnologiesWeeklyTable {
  date_week: string;
  category: string;
  tech: string;
  hits: number;
}
export type TechnologyWeeklyRow = Selectable<TechnologiesWeeklyTable>;

export interface Database {
  repositories: RepositoriesTable;
  technologies: TechnologiesTable;
  technologies_weekly: TechnologiesWeeklyTable;
}

export type TX = Transaction<Database>;
