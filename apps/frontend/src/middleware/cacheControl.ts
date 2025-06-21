import { createMiddleware } from '@tanstack/react-start';
import { setHeaders } from '@tanstack/react-start/server';

export const cacheControlMiddleware = createMiddleware({ type: 'function' }).server(
  async ({ next }) => {
    setHeaders({
      'cache-control': 'public, max-age=3600',
    });
    return await next();
  }
);
