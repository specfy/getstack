import type { Endpoint } from './api';
import type { TechnologyWeeklyRow } from '../db/types';
import type { TechType } from '@specfy/stack-analyser';

export type APIGetTop = Endpoint<{
  Path: '/v1/top';
  Method: 'GET';
  Success: {
    success: true;
    data: { category: TechType; rows: TechnologyWeeklyRow[] }[];
  };
}>;
