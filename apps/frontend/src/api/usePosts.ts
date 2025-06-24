/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { queryOptions, useQuery } from '@tanstack/react-query';
import { notFound } from '@tanstack/react-router';

import { API_URL } from '../lib/envs';

import type { APIGetPost, APIGetPosts } from '../../../backend/src/types/endpoint';

export const usePosts = () => {
  return useQuery<APIGetPosts['Success']['data'], Error>(optionsGetPosts());
};

export const optionsGetPosts = () => {
  return queryOptions<APIGetPosts['Success']['data'], Error>({
    queryKey: ['getPosts'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/posts`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetPosts['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json.data;
    },
  });
};

export const optionsGetPost = (id: number) => {
  return queryOptions<APIGetPost['Success']['data'], Error>({
    queryKey: ['getPost', id],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/1/posts/${id}`, {
        method: 'GET',
      });

      if (response.status === 404) {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw notFound();
      }

      const json = (await response.json()) as APIGetPost['Reply'];
      if ('error' in json) {
        throw new Error('error');
      }

      return json.data;
    },
  });
};
