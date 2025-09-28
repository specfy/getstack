/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { queryOptions, useQuery } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { API_URL } from '../lib/envs';

import type {
  APIGetCategory,
  APIGetCategoryLeaderboard,
} from '../../../backend/src/types/endpoint';

export const useCategory = (options: { name?: string }) => {
  return useQuery<APIGetCategory['Success'], Error>(optionsGetCategory(options));
};

export const optionsGetCategory = ({ name }: { name?: string }) => {
  return queryOptions<APIGetCategory['Success'], Error>({
    enabled: Boolean(name),
    queryKey: ['getCategory', name],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/categories/${name}`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetCategory['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};

export const useCategoryLeaderboard = ({ name }: { name?: string | undefined }) => {
  return useQuery<APIGetCategoryLeaderboard['Success'], Error>(
    optionsCategoryLeaderboardOptions({ name })
  );
};

export const optionsCategoryLeaderboardOptions = ({ name }: { name?: string | undefined }) => {
  return queryOptions<APIGetCategoryLeaderboard['Success'], Error>({
    enabled: Boolean(name),
    queryKey: ['getCategoryLeaderboard', name],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/categories/${name}/leaderboard`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetCategoryLeaderboard['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};
