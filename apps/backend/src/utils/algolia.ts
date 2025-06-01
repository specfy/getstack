import { algoliasearch } from 'algoliasearch';

import { envs } from './env.js';

export const algolia = algoliasearch(envs.ALGOLIA_APP_ID || '', envs.ALGOLIA_API_KEY || '');
