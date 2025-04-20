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
  ignored: boolean;
  created_at: CreatedAt;
  updated_at: UpdatedAt;
  last_fetched_at: Date | null;
}

export type RepositoryRow = Selectable<RepositoriesTable>;
export type RepositoryInsert = Insertable<RepositoriesTable>;
export type RepositoryUpdate = Updateable<RepositoriesTable>;

export interface Database {
  repositories: RepositoriesTable;
}

export type TX = Transaction<Database>;
