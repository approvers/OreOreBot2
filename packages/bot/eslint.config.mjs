import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import markdown from '@eslint/markdown';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tsdoc from 'eslint-plugin-tsdoc';
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
    'eslint:recommended',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'prettier'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      markdown,
      tsdoc
    },

    languageOptions: {
      globals: {
        ...globals.node
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: true
      }
    },

    rules: {
      'max-params': 'error',
      'tsdoc/syntax': 'warn',

      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true
        }
      ]
    }
  },
  {
    files: ['**/*.md'],
    processor: 'markdown/markdown'
  }
];
