import js from '@eslint/js';

const browserGlobals = {
  window: 'readonly', document: 'readonly', localStorage: 'readonly',
  sessionStorage: 'readonly', fetch: 'readonly', console: 'readonly',
  setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly',
  clearInterval: 'readonly', navigator: 'readonly', alert: 'readonly',
  confirm: 'readonly', URL: 'readonly', FormData: 'readonly',
  requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly',
  IntersectionObserver: 'readonly', ResizeObserver: 'readonly',
  Image: 'readonly', location: 'readonly', history: 'readonly',
};

const nodeGlobals = {
  process: 'readonly', console: 'readonly', Buffer: 'readonly',
  setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly',
  clearInterval: 'readonly', URL: 'readonly',
};

const sharedRules = {
  // Capitalised names are React components used in JSX, so ignore them.
  'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
};

export default [
  { ignores: ['**/node_modules/**', '**/dist/**'] },
  js.configs.recommended,
  {
    files: ['apps/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: browserGlobals,
    },
    rules: sharedRules,
  },
  {
    files: ['services/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: nodeGlobals,
    },
    rules: sharedRules,
  },
];