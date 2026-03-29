import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
  {
    // Globally ignore build artifacts and dependency folders
    ignores: [
      '.nuxt/**',
      '.output/**',
      'node_modules/**',
      'dist/**',
      'public/**',
      'hyperformula docs/**' // User's custom folder with potential issues
    ],
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        // For Nuxt/Vue 3, allow template features
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      // Only check for parsing errors as requested
      'vue/no-parsing-error': 'error',
    },
  },
];