// @ts-check
import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import * as mdx from 'eslint-plugin-mdx';
import globals from 'globals';
import tsESLint from 'typescript-eslint';

export default tsESLint.config(
  eslint.configs.recommended,
  ...tsESLint.configs.recommended,
  prettier,
  mdx.flat,
  mdx.flatCodeBlocks,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mdx'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
      parserOptions: {
        sourceType: 'module',
        project: true,
        ecmaFeatures: {
          jsx: true
        },
        tsconfigRootDir: import.meta.dir,
        globals: {
          ...globals.browser
        }
      }
    },
    plugins: {
      '@next/next': nextPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      'max-params': 'error',
      // disabled for a glitch on these
      '@next/next/no-duplicate-head': 'off',
      '@next/next/no-page-custom-font': 'off',
      'react/display-name': 'off'
    }
  },
  {
    ignores: ['./.next/*']
  }
);
