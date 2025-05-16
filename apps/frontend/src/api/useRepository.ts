import { useQuery } from '@tanstack/react-query';

import { API_URL, ApiResError } from './api.js';

import type { APIGetRepository } from '@stackhub/backend/src/types/endpoint.js';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useRepository = ({ org, name }: { org: string; name: string }) => {
  return useQuery<APIGetRepository['Success'], Error>({
    enabled: Boolean(name),
    queryKey: ['getRepository', name],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/repositories/${org}/${name}`, {
        method: 'GET',
      });

      const json = (await response.json()) as APIGetRepository['Reply'];
      if ('error' in json) {
        throw new ApiResError(json);
      }

      return json;
    },
  });
};
