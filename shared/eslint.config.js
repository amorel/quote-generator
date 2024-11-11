module.exports = [
  {
    // Configuration de base
    ignores: [
      '**/dist/**',
      '**/coverage/**',
      '**/*.d.ts',
      '**/*.js'
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        node: true,
        jest: true,
        browser: true,
        es2021: true,
        process: true,
        console: true,
        module: true,
        require: true,
        describe: true,
        it: true,
        expect: true,
        beforeAll: true,
        afterAll: true,
        beforeEach: true
      }
    }
  },
  {
    // Configuration TypeScript seulement pour src/ et tests/
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_' 
      }]
    }
  }
];