import type { Endpoint } from './api.js';
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
  hits: number;
  position: number;
}
export type APIGetCategory = Endpoint<{
  Path: '/v1/categories/:category';
  Method: 'GET';
  Success: {
    success: true;
    data: { list: TechnologyByCategoryByWeekWithTrend[]; top: TechnologyTopN[] };
  };
}>;
