/// <reference types="vinxi/types/server" />
import { getRouterManifest } from '@tanstack/react-start/router-manifest';
import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';

import { createRouter } from './router';

const handler = createStartHandler({
  createRouter,
  getRouterManifest,
})(defaultStreamHandler);

export default async function wrappedHandler(request: Request) {
  const response = await handler(request);
  (response as Response).headers.set('Cache-Control', 'public, max-age=3600');
  return response;
}
