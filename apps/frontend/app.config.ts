import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path'

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  server: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
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
})
