import { API_URL } from '../lib/envs';

import type { APIPostSubscribe } from '../../../backend/src/types/endpoint';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const postSubscribe = async (body: APIPostSubscribe['Body']) => {
  const response = await fetch(`${API_URL}/1/newsletter`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' },
  });

  if (response.status !== 200) {
    throw new Error(`API error: POST /1/newsletter returned status ${response.status}`);
  }

  const json = (await response.json()) as APIPostSubscribe['Reply'];
  if ('error' in json) {
    throw new Error(`API error: POST /1/newsletter - ${JSON.stringify(json.error)}`);
  }

  return json;
};
