/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { queryOptions, useQuery } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { API_URL } from './api.js';

import type {
  APIGetLicense,
  APIGetLicenses,
  APIGetLicensesLeaderboard,
} from '@getstack/backend/src/types/endpoint.js';

export const useLicenses = () => {
  return useQuery<APIGetLicenses['Success'], Error>(optionsGetLicenses());
};

export const optionsGetLicenses = () => {
  return queryOptions<APIGetLicenses['Success'], Error>({
    queryKey: ['getLicenses'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/licenses`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetLicenses['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};

export const useLicense = (options: { key?: string }) => {
  return useQuery<APIGetLicense['Success'], Error>(optionsGetLicense(options));
};

export const optionsGetLicense = ({ key }: { key?: string }) => {
  return queryOptions<APIGetLicense['Success'], Error>({
    enabled: Boolean(key),
    queryKey: ['getLicense', key],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/licenses/${key}`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetLicense['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};

export const useLicensesLeaderboard = () => {
  return useQuery<APIGetLicensesLeaderboard['Success'], Error>({
    queryKey: ['getLicensesLeaderboard'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/licenses/leaderboard`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetLicensesLeaderboard['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json;
    },
  });
};
