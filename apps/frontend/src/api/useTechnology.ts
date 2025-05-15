import { useQuery } from '@tanstack/react-query';

import { API_URL } from './api.js';

import type { APIGetTechnology } from '@stackhub/backend/src/types/endpoint.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useTechnology = ({ name }: { name?: string | undefined }) => {
  return useQuery<APIGetTechnology['Success'], Error>({
    enabled: Boolean(name),
    queryKey: ['getTechnology', name],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/technologies/${name}`, {
        method: 'GET',
      });

      if (response.status !== 200) {
        throw new Error('error');
      }

      const json = (await response.json()) as APIGetTechnology['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};
