import type { Endpoint } from './api.js';
import type {
  LicensesInfoTableRow,
  LicensesWeeklyRow,
  RepositoryRow,
  TechnologiesWeeklyTable,
  TechnologyRow,
  TechnologyWeeklyRow,
} from '../db/types.js';
import type { AllowedKeys, TechType } from '@specfy/stack-analyser';
import type { AllowedLicenses } from '@specfy/stack-analyser/dist/types/licenses.js';

export interface TechnologyByCategoryByWeekWithTrend {
  category: TechType;
  tech: AllowedKeys;
  current_hits: number;
  previous_hits: number;
  trend: number;
  percent_change: number;
}
export type APIGetTop = Endpoint<{
  Path: '/1/top';
  Method: 'GET';
  Success: {
    success: true;
    data: { category: TechType; rows: TechnologyByCategoryByWeekWithTrend[] }[];
  };
}>;

export interface TechnologyTopN {
  date_week: string;
  tech: AllowedKeys;
  hits: string;
  position: string;
}
export type APIGetCategory = Endpoint<{
  Path: '/1/categories/:name';
  Method: 'GET';
  Success: {
    success: true;
    data: { top: TechnologyTopN[] };
  };
}>;

export type APIGetCategoryLeaderboard = Endpoint<{
  Path: '/1/categories/:name/leaderboard';
  Method: 'GET';
  Success: {
    success: true;
    data: TechnologyByCategoryByWeekWithTrend[];
  };
}>;

export type RepositoryTop = Pick<RepositoryRow, 'avatar_url' | 'id' | 'name' | 'org' | 'stars'>;
export type TechnologyWeeklyVolume = Pick<TechnologiesWeeklyTable, 'date_week' | 'hits'>;
export type APIGetTechnology = Endpoint<{
  Path: '/1/technologies/:name';
  Method: 'GET';
  Success: {
    success: true;
    data: { cumulatedStars: number; topRepos: RepositoryTop[]; volume: TechnologyWeeklyVolume[] };
  };
}>;

export type RelatedTechnology = Pick<TechnologyWeeklyRow, 'hits' | 'tech'>;
export type APIGetTopRelatedTechnology = Endpoint<{
  Path: '/1/technologies/:name/related';
  Method: 'GET';
  Success: {
    success: true;
    data: RelatedTechnology[];
  };
}>;

export type APIGetRepository = Endpoint<{
  Path: '/1/repositories/:org/:name';
  Method: 'GET';
  Success: {
    success: true;
    data: { repo: RepositoryRow; techs: TechnologyRow[] };
  };
}>;

export type APIPostSubscribe = Endpoint<{
  Path: '/1/newsletter';
  Method: 'POST';
  Body: { email: string };
  Success: {
    success: true;
    message: string;
  };
}>;

export interface LicenseTopN {
  date_week: string;
  license: string;
  hits: string;
  position: string;
}
export type APIGetLicenses = Endpoint<{
  Path: '/1/licenses';
  Method: 'GET';
  Success: {
    success: true;
    data: { top: LicenseTopN[] };
  };
}>;

export interface LicenseLeaderboard {
  license: AllowedLicenses;
  current_hits: number;
  previous_hits: number;
  trend: number;
  percent_change: number;
}
export type APIGetLicensesLeaderboard = Endpoint<{
  Path: '/1/licenses/leaderboard';
  Method: 'GET';
  Success: {
    success: true;
    data: LicenseLeaderboard[];
  };
}>;

export type LicenseWeeklyVolume = Pick<LicensesWeeklyRow, 'date_week' | 'hits'>;
export type APIGetLicense = Endpoint<{
  Path: '/1/licenses/:key';
  Method: 'GET';
  Success: {
    success: true;
    data: {
      license: LicensesInfoTableRow;
      cumulatedStars: number;
      topRepos: RepositoryTop[];
      volume: LicenseWeeklyVolume[];
    };
  };
}>;
