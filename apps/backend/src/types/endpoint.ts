import type { Endpoint } from './api.js';
import type {
  LicenseRow,
  LicensesWeeklyRow,
  TechnologiesWeeklyTable,
  TechnologyRow,
  TechnologyWeeklyRow,
} from '../db/types.clickhouse.js';
import type { LicensesInfoTableRow, PostsRow, RepositoryRow } from '../db/types.db.js';
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

export type APILicenseWithName = { full_name: string } & LicenseRow;
export type APIGetRepository = Endpoint<{
  Path: '/1/repositories/:org/:name';
  Method: 'GET';
  Success: {
    success: true;
    data: { repo: RepositoryRow; techs: TechnologyRow[]; licenses: APILicenseWithName[] };
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
export type APILicenseTopN = { full_name: string } & LicenseTopN;
export type APIGetLicenses = Endpoint<{
  Path: '/1/licenses';
  Method: 'GET';
  Success: {
    success: true;
    data: { top: APILicenseTopN[] };
  };
}>;

export interface LicenseLeaderboard {
  license: AllowedLicenses;
  current_hits: number;
  previous_hits: number;
  trend: number;
  percent_change: number;
}
export type APILicenseLeaderboard = { full_name: string } & LicenseLeaderboard;
export type APIGetLicensesLeaderboard = Endpoint<{
  Path: '/1/licenses/leaderboard';
  Method: 'GET';
  Success: {
    success: true;
    data: APILicenseLeaderboard[];
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

export type APIGetData = Endpoint<{
  Path: '/1/data';
  Method: 'GET';
  Success: {
    success: true;
    data: {
      lastRefresh: string;
      inProgress: boolean;
    };
  };
}>;

type DateToString<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K];
};
export type APIPostSimple = DateToString<
  Pick<PostsRow, 'id' | 'metadata' | 'summary' | 'title' | 'updated_at'>
>;
export type APIGetPosts = Endpoint<{
  Path: '/1/posts';
  Method: 'GET';
  Success: {
    success: true;
    data: APIPostSimple[];
  };
}>;

export type APIPost = DateToString<PostsRow>;
export type APIGetPost = Endpoint<{
  Path: '/1/posts/:id';
  Method: 'GET';
  Params: { id: number };
  Success: {
    success: true;
    data: APIPost;
  };
}>;
