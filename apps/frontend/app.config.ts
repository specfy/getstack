import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from '@tanstack/react-start/config';
import { cloudflare } from 'unenv';
import tsConfigPaths from 'vite-tsconfig-paths';

const imageHeaders = {
  'cache-control': 'public,max-age=86400',
};
const staticCacheControlHeaders = {
  'cache-control': 'public,max-age=31536000,s-maxage=31536000,immutable',
};

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  server: {
    preset: 'node_server',
    unenv: cloudflare,
    routeRules: {
      '/favicons/**': { headers: imageHeaders },
      '/_build/assets/**': { headers: staticCacheControlHeaders },
    },
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
    ],
    ssr: {
      noExternal: ['react-use'],
    },
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
        // https://github.com/tabler/tabler-icons/issues/1233
        // /esm/icons/index.mjs only exports the icons statically, so no separate chunks are created
        '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      },
    },
  },
});
