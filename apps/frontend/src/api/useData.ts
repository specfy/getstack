/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useQuery } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { apiFetch } from '../lib/fetch';

import type { APIGetData } from '@getstack/backend/src/types/endpoint';

export const useData = () => {
  return useQuery<APIGetData['Success'], Error>({
    queryKey: ['getData'],
    queryFn: async () => {
      const response = await apiFetch('/1/data', {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetData['Reply'];
      if ('error' in json) {
        throw new Error(`API error: ${JSON.stringify(json.error)}`);
      }

      return json;
    },
  });
};
