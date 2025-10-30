module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  
  // Test environment
  testEnvironment: 'jsdom',
  
  // Global setup
  globalSetup: 'jest-preset-angular/global-setup',
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'html', 'js', 'json'],
  
  // Transform files
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  
  // Transform ignore patterns
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)',
  ],
  
  // Test match patterns
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
  ],
  
  // Collect coverage from
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/environments/**',
    '!src/test.ts',
    '!src/**/*.spec.ts'
  ],
  
  // Coverage directory
  coverageDirectory: 'coverage',
  
  // Coverage reporters
  coverageReporters: ['html', 'text-summary', 'lcov', 'json'],
  
  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  
  // Clear mocks
  clearMocks: true,
  
  // Restore mocks
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
};