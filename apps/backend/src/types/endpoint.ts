import type { Endpoint } from './api.js';
import type {
  RepositoryRow,
  TechnologiesWeeklyTable,
  TechnologyRow,
  TechnologyWeeklyRow,
} from '../db/types.js';
import type { AllowedKeys, TechType } from '@specfy/stack-analyser';

export interface TechnologyByCategoryByWeekWithTrend {
  category: TechType;
  tech: AllowedKeys;
  current_hits: number;
  previous_hits: number;
  trend: number;
  percent_change: number;
}
export type APIGetTop = Endpoint<{
  Path: '/v1/top';
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
  Path: '/v1/categories/:name';
  Method: 'GET';
  Success: {
    success: true;
    data: { top: TechnologyTopN[] };
  };
}>;

export type APIGetCategoryLeaderboard = Endpoint<{
  Path: '/v1/categories/:name/leaderboard';
  Method: 'GET';
  Success: {
    success: true;
    data: TechnologyByCategoryByWeekWithTrend[];
  };
}>;

export type RepositoryTop = Pick<RepositoryRow, 'avatar_url' | 'name' | 'org' | 'stars' | 'url'>;
export type TechnologyWeeklyVolume = Pick<TechnologiesWeeklyTable, 'date_week' | 'hits'>;
export type APIGetTechnology = Endpoint<{
  Path: '/v1/technologies/:name';
  Method: 'GET';
  Success: {
    success: true;
    data: { cumulatedStars: number; topRepos: RepositoryTop[]; volume: TechnologyWeeklyVolume[] };
  };
}>;

export type RelatedTechnologyByCategory = Pick<TechnologyWeeklyRow, 'category' | 'hits' | 'tech'>;
export type RelatedTechnology = Pick<TechnologyWeeklyRow, 'hits' | 'tech'>;
export type APIGetTopRelatedTechnology = Endpoint<{
  Path: '/v1/technologies/:name/related';
  Method: 'GET';
  Success: {
    success: true;
    data: RelatedTechnology[];
  };
}>;

export type APIPostRepositorySearch = Endpoint<{
  Path: '/v1/repositories/search';
  Method: 'POST';
  Success: {
    success: true;
    data: RepositoryRow[];
  };
}>;

export type APIGetRepository = Endpoint<{
  Path: '/v1/repositories/:org/:name';
  Method: 'GET';
  Success: {
    success: true;
    data: { repo: RepositoryRow; techs: TechnologyRow[] };
  };
}>;
