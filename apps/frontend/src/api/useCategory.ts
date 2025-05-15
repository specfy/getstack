import { useQuery } from '@tanstack/react-query';

import { API_URL } from './api';

import type {
  APIGetCategory,
  APIGetCategoryLeaderboard,
} from '../../../backend/src/types/endpoint';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useCategory = ({ name }: { name: string }) => {
  return useQuery<APIGetCategory['Success'], Error>({
    queryKey: ['getCategory', name],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/categories/${name}`, {
        method: 'GET',
      });

      if (response.status !== 200) {
        throw new Error('error');
      }

      const json = (await response.json()) as APIGetCategory['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useCategoryLeaderboard = ({ name }: { name?: string | undefined }) => {
  return useQuery<APIGetCategoryLeaderboard['Success'], Error>({
    enabled: Boolean(name),
    queryKey: ['getCategoryLeaderboard', name],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/categories/${name}/leaderboard`, {
        method: 'GET',
      });

      if (response.status !== 200) {
        throw new Error('error');
      }

      const json = (await response.json()) as APIGetCategoryLeaderboard['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};
