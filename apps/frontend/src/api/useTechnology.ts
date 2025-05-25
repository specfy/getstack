/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { queryOptions, useQuery } from '@tanstack/react-query';

import { API_URL } from './api.js';

import type {
  APIGetTechnology,
  APIGetTopRelatedTechnology,
} from '@getstack/backend/src/types/endpoint.js';

export const useTechnology = (options: { name?: string | undefined }) => {
  return useQuery<APIGetTechnology['Success'], Error>(optionsGetTechnology(options));
};

export const optionsGetTechnology = ({ name }: { name?: string | undefined }) => {
  return queryOptions<APIGetTechnology['Success'], Error>({
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

export const useRelatedTechnology = ({ name }: { name?: string | undefined }) => {
  return useQuery<APIGetTopRelatedTechnology['Success'], Error>({
    enabled: Boolean(name),
    queryKey: ['getTechnologyRelated', name],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/technologies/${name}/related`, {
        method: 'GET',
      });

      if (response.status !== 200) {
        throw new Error('error');
      }

      const json = (await response.json()) as APIGetTopRelatedTechnology['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};
