import { defineConfig } from 'eslint-define-config';
import eslintPluginNode from 'eslint-plugin-node';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginEjs from 'eslint-plugin-ejs';
import eslintPluginHtml from 'eslint-plugin-html';

export default defineConfig([
  {
    languageOptions: {
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      node: eslintPluginNode,
      prettier: eslintPluginPrettier,
      ejs: eslintPluginEjs,
      html: eslintPluginHtml,
    },
    extends: [
      'eslint:recommended', // Basic ESLint rules
      'plugin:prettier/recommended', // Integrates Prettier with ESLint
    ],
    rules: {
      // Custom rules can be added here if needed
    },
  },
  {
    files: ['*.ejs'],
    processor: 'ejs/ejs',
  },
  {
    files: ['*.html'],
    processor: 'html/html',
  },
]);
