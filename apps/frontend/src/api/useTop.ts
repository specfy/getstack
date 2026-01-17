import { queryOptions, useQuery } from '@tanstack/react-query';

import { apiFetch } from '../lib/fetch';

import type { APIGetTop } from '../../../backend/src/types/endpoint';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useTop = () => {
  return useQuery<APIGetTop['Success'], Error>(optionsGetTop());
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const optionsGetTop = () => {
  return queryOptions<APIGetTop['Success'], Error>({
    queryKey: ['getTop'],
    queryFn: async () => {
      const response = await apiFetch('/1/top', {
        method: 'GET',
      });

      if (response.status !== 200) {
        throw new Error(`API error: GET /1/top returned status ${response.status}`);
      }

      const json = (await response.json()) as APIGetTop['Reply'];
      if ('error' in json) {
        throw new Error(`API error: ${JSON.stringify(json.error)}`);
      }

      return json;
    },
  });
};
