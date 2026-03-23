/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { queryOptions } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { apiFetch } from '../lib/fetch';

import type { APIGetCategoryTrends } from '../../../backend/src/types/endpoint';

export const optionsGetCategoryTrends = ({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) => {
  return queryOptions<APIGetCategoryTrends['Success'], Error>({
    queryKey: ['getCategoryTrends', slug],
    queryFn: async () => {
      const response = await apiFetch(`/1/categories/${category}/trends/${slug}`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetCategoryTrends['Reply'];
      if ('error' in json) {
        throw new Error(
          `API error: GET /1/categories/trends/${slug} - ${JSON.stringify(json.error)}`
        );
      }

      return json;
    },
  });
};
