import lint from '@h1fra/eslint-config';
import globals from 'globals';

export default [
  {
    ignores: ['**/dist/', '**/node_modules/', '**/.wrangler'],
  },
  ...lint.configs.base,
  ...lint.configs.strict,
  {
    settings: {},
    rules: {
      'import-x/extensions': 'off', // does not work for some reason
      'import-x/no-extraneous-dependencies': 'off', // does not work for some reason
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
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
    },
  },
  {
    files: ['**/migrations/*.ts'],
    rules: {
      'unicorn/filename-case': 'off',
    },
  },
  {
    files: ['apps/frontend/src/components/ui/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/naming-convention': 'off',
      'unicorn/filename-case': 'off',
    },
  },
];
