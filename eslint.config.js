import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tseslint from 'typescript-eslint';

export default [
  {
    // Globally ignore build artifacts and dependency folders
    ignores: [
      '.nuxt/**',
      '.output/**',
      'node_modules/**',
      'dist/**',
      'public/**',
      'hyperformula docs/**'
    ],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      // Only check for parsing errors as requested
      'vue/no-parsing-error': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];