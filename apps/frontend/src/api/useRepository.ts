/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { queryOptions, useQuery } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { API_URL, ApiResError } from './api.js';

import type {
  APIGetRepository,
  APIPostRepositorySearch,
} from '@getstack/backend/src/types/endpoint.js';

export const useRepository = (opts: { org: string; name: string }) => {
  return useQuery<APIGetRepository['Success'], Error>(optionsGetRepository(opts));
};
export const optionsGetRepository = ({ org, name }: { org: string; name: string }) => {
  return queryOptions<APIGetRepository['Success'], Error>({
    enabled: Boolean(name),
    queryKey: ['getRepository', name],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/repositories/${org}/${name}`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetRepository['Reply'];
      if ('error' in json) {
        throw new ApiResError(json);
      }

      return json;
    },
  });
};

export const useRepositorySearch = ({ search }: { search: string }) => {
  return useQuery<APIPostRepositorySearch['Success'], Error>({
    enabled: Boolean(search),
    queryKey: ['postRepositorySearch', search],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/repositories/search`, {
        method: 'POST',
        body: JSON.stringify({ search }),
        headers: { 'content-type': 'application/json' },
      });

      const json = (await response.json()) as APIPostRepositorySearch['Reply'];
      if ('error' in json) {
        throw new ApiResError(json);
      }

      return json;
    },
  });
};
