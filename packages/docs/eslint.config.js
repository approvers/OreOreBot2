// @ts-check
import eslint from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';
import * as mdx from 'eslint-plugin-mdx';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';
import tsESLint from 'typescript-eslint';

export default tsESLint.config(
  eslint.configs.recommended,
  ...tsESLint.configs.recommended,
  prettier,
  mdx.flat,
  mdx.flatCodeBlocks,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
      parserOptions: {
        sourceType: 'module',
        project: true,
        ecmaFeatures: {
          jsx: true
        },
        tsconfigRootDir: import.meta.dir
      }
    },
    plugins: {
      '@next/next': nextPlugin
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      'max-params': 'error',
      // disabled for a glitch on these
      '@next/next/no-duplicate-head': 'off',
      '@next/next/no-page-custom-font': 'off'
    }
  },
  {
    files: ['**/*.{js,jsx,ts,tsx,mdx}'],
    ...reactRecommended,
    languageOptions: {
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.browser
      }
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // disabled for a glitch on this
      'react/display-name': 'off'
    }
  },
  {
    ignores: ['./.next/*']
  }
);
