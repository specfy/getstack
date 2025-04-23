import type { Endpoint } from './api';
import type { AllowedKeys, TechType } from '@specfy/stack-analyser';

export interface TechnologyByCategoryByWeekWithTrend {
  category: TechType;
  tech: AllowedKeys;
  current_hits: string;
  previous_hits: string;
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
