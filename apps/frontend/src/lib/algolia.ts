import { liteClient } from 'algoliasearch/lite';

import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from './envs';

export const algolia = liteClient(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
