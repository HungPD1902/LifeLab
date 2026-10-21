const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/**',
      'dist-all/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
]);
