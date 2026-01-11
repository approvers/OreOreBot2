import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import eslintPluginAstro from 'eslint-plugin-astro';
import react from 'eslint-plugin-react';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  ...compat.extends(
    'prettier',
    'eslint:recommended',
    'plugin:mdx/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:mdx/recommended'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      react
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },

    settings: {
      'mdx/code-blocks': true,

      react: {
        version: 'detect'
      }
    },

    rules: {
      'max-params': 'error'
    }
  },
  ...eslintPluginAstro.configs.recommended
];
