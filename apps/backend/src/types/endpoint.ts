import type { Endpoint } from './api';
import type { TechnologyWeeklyRow } from '../db/types';

export type APIGetTop = Endpoint<{
  Path: '/v1/top';
  Method: 'GET';
  Success: {
    success: true;
    data: { category: string; rows: TechnologyWeeklyRow[] }[];
  };
}>;
