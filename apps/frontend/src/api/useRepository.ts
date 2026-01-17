/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { queryOptions, useQuery } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { ApiResError } from './api.js';
import { apiFetch } from '../lib/fetch';
import { ALGOLIA_INDEX_NAME } from '../lib/envs';
import { algolia } from '@/lib/algolia.js';

import type { AlgoliaRepositoryObject } from '@getstack/backend/src/types/algolia.js';
import type { APIGetRepository } from '@getstack/backend/src/types/endpoint.js';

export const useRepository = (opts: { org: string; name: string }) => {
  return useQuery<APIGetRepository['Success'], Error>(optionsGetRepository(opts));
};
export const optionsGetRepository = ({ org, name }: { org: string; name: string }) => {
  return queryOptions<APIGetRepository['Success'], Error>({
    enabled: Boolean(name),
    queryKey: ['getRepository', name],
    queryFn: async () => {
      const response = await apiFetch(`/1/repositories/${org}/${name}`, {
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

export const useRepositorySearchAlgolia = ({ search }: { search: string }) => {
  return useQuery<AlgoliaRepositoryObject[], Error>({
    enabled: Boolean(search),
    queryKey: ['algoliaRepositorySearch', search],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const res = await algolia.searchForHits<AlgoliaRepositoryObject>({
        requests: [{ indexName: ALGOLIA_INDEX_NAME, query: search, hitsPerPage: 20 }],
      });

      return res.results[0].hits;
    },
  });
};
