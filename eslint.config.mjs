// eslint.config.mjs
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',

      'prefer-const': ['warn'],
      'arrow-spacing': ['error', { 'before': true, 'after': true }],
      'no-console': ['warn', { 'allow': ['warn', 'error'] }],
      'no-undef': 'warn',
      'consistent-return': 'error',
      'no-multiple-empty-lines': ['error', { 'max': 1 }],
      'no-var': 'error',
      'no-magic-numbers': ['error', { 'ignore': [0, 1] }],
      'camelcase': 'warn',
      'no-mixed-spaces-and-tabs': 'error',
      'eqeqeq': ['error', 'always'],
      'no-unused-vars': ['warn'],
      'quotes': ['error', 'single'],  // Используем одинарные кавычки
      'semi': ['error', 'always'],  // Требуем точку с запятой
      'indent': ['error', 2],  // Делаем отступ в 2 пробела
      'max-len': ['error', { 'code': 100 }],  // Ограничиваем длину строки
      'no-trailing-spaces': 'error',  // Запрещаем пробелы в конце строки
      'eol-last': ['error', 'always'],  // Требуем пустую строку в конце файла
      'comma-dangle': ['error', 'always-multiline'],  // Запятые на последних элементах
      "brace-style": [
        "error",
        "1tbs", // Один стиль скобок
        { "allowSingleLine": false } // Запрещает одну строку для скобок
      ]

    },
  },
);
