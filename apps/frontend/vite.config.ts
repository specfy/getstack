import path from 'node:path';

import contentCollections from '@content-collections/vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

import type { PluginOption } from 'vite';

// const imageHeaders = {
//   'cache-control': 'public,max-age=86400',
// } as const;
// const staticCacheControlHeaders = {
//   'cache-control': 'public,max-age=31536000,s-maxage=31536000,immutable',
// } as const;

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro({ preset: 'node-server' }),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    contentCollections(),
  ] as PluginOption[],

  ssr: {
    noExternal: ['react-use'],
    target: 'node',
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Create a chunk for the blog index page
          if (id.includes('/blog/index.tsx')) {
            return 'blog-index';
          }

          // Create separate chunks for each blog post
          if (id.includes('/blog/$slug.tsx')) {
            return 'blog-post';
          }
        },
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
});
