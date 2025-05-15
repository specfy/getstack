import type { Endpoint } from './api.js';
import type { RepositoryRow, TechnologiesWeeklyTable } from '../db/types.js';
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

export type RepositoryTop = Pick<RepositoryRow, 'name' | 'org' | 'stars' | 'url'>;
export type TechnologyWeeklyVolume = Pick<TechnologiesWeeklyTable, 'date_week' | 'hits'>;
export type APIGetTechnology = Endpoint<{
  Path: '/v1/technologies/:name';
  Method: 'GET';
  Success: {
    success: true;
    data: { cumulatedStars: number; topRepos: RepositoryTop[]; volume: TechnologyWeeklyVolume[] };
  };
}>;
