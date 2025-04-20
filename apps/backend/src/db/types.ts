import type { ColumnType, Insertable, Selectable, Transaction, Updateable } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date, Date | string>;
export type CreatedAt = ColumnType<Date, Date | undefined, never>;
export type UpdatedAt = ColumnType<Date, Date | undefined, Date>;
export type BooleanDefault = ColumnType<boolean, boolean | undefined>;

export interface Database {
  repositories: RepositoriesTable
}

export interface RepositoriesTable {
  id: string
  org: string
  name: string
  created_at: Date
  updated_at: Date
  last_fetched_at: Date | null
}


export type TX = Transaction<Database>;
