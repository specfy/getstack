import type { AllowedLicensesLowercase } from '../types/stack.js';
import type { AllowedKeys, TechType } from '@specfy/stack-analyser';
import type { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export type TimestampClickhouse = ColumnType<string, Date, Date | string>;
export type Timestamp = ColumnType<Date, Date, Date | string>;
export type CreatedAt = ColumnType<string, Date | undefined, never>;
export type UpdatedAt = ColumnType<string, Date | undefined, Date>;
export type BooleanDefault = ColumnType<boolean, boolean | undefined>;

export interface RepositoriesClickhouse {
  id: string;
  org: string;
  name: string;
  stars: number;
  updated_at: UpdatedAt;
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
  license: AllowedLicensesLowercase;
  date_week: string;
}
export type LicenseRow = Selectable<LicensesTable>;
export type LicenseInsert = Insertable<LicensesTable>;
export type LicenseUpdate = Updateable<LicensesTable>;

export interface LicensesWeeklyTable {
  date_week: string;
  license: AllowedLicensesLowercase;
  hits: number;
}
export type LicensesWeeklyRow = Selectable<LicensesWeeklyTable>;

export interface Clickhouse {
  repositories2: RepositoriesClickhouse;
  technologies: TechnologiesTable;
  technologies_weekly: TechnologiesWeeklyTable;
  licenses: LicensesTable;
  licenses_weekly: LicensesWeeklyRow;
}
