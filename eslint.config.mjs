import lint from '@h1fra/eslint-config';
import globals from 'globals';

export default [
  {
    ignores: [
      '**/dist/',
      '**/node_modules/',
      '**/.wrangler',
      '**/.content-collections/',
      '**/.tanstack',
      '**/.output',
    ],
  },
  ...lint.configs.base,
  ...lint.configs.strict,
  ...lint.configs.tailwind,
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },
  {
    settings: {
      tailwindcss: {
        callees: ['cn'],
        config: 'apps/frontend/tailwind.config.js',
      },
    },
  },
  {
    files: ['apps/frontend/**/*.{tsx,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...Object.fromEntries(Object.entries(globals.node).map(([key]) => [key, 'off'])),
      },

      ecmaVersion: 2024,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
          jsx: false,
        },

        project: 'apps/frontend/tsconfig.json',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'import-x/extensions': 'off',
    },
  },
  {
    files: ['**/migrations/*.ts'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
  {
    files: ['apps/frontend/src/components/ui/**.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'unicorn/filename-case': 'off',
      'tailwindcss/no-custom-classname': 'off',
    },
  },
  {
    files: [
      'apps/frontend/src/components/**.tsx',
      'apps/backend/src/db/migrationsClickhouse/**',
      'apps/backend/src/db/migrationsDb/**',
    ],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
];
