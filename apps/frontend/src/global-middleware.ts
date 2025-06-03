import { registerGlobalMiddleware } from '@tanstack/react-start';

import { cacheControlMiddleware } from './middleware/cacheControl';

registerGlobalMiddleware({
  middleware: [cacheControlMiddleware],
});
