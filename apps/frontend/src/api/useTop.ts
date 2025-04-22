import { useQuery } from '@tanstack/react-query';

import { API_HOSTNAME } from './api';

import type { APIGetTop } from '../../../backend/src/types/endpoint';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useTop = () => {
  return useQuery<APIGetTop['Success'], Error>({
    queryKey: ['getTop'],
    queryFn: async () => {
      const response = await fetch(`${API_HOSTNAME}/1/top`, {
        method: 'GET',
      });

      if (response.status !== 200) {
        throw new Error('error');
      }

      const json = (await response.json()) as APIGetTop['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};
