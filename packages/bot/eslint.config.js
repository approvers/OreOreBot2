// @ts-check
import eslint from '@eslint/js';
import markdown from 'eslint-plugin-markdown';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';
import tsESLint from 'typescript-eslint';

export default tsESLint.config(
  eslint.configs.recommended,
  ...tsESLint.configs.recommended,
  ...tsESLint.configs.strictTypeChecked,
  ...tsESLint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
      parserOptions: {
        sourceType: 'module',
        project: true
      }
    },
    plugins: {
      markdown,
      tsdoc
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowBoolean: true,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
          allowNever: false
        }
      ],
      'max-params': 'error',
      'tsdoc/syntax': 'warn'
    }
  },
  {
    files: ['**/*.md'],
    processor: 'markdown/markdown'
  }
);
