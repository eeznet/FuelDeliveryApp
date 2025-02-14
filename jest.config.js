export default {
  transform: {
    '^.+\\.m?js$': ['babel-jest', { configFile: './babel.config.js' }]
  },
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js'],
  moduleFileExtensions: ['js', 'mjs', 'json'],
  collectCoverage: true,
  clearMocks: true,
  coverageDirectory: "coverage",
  transformIgnorePatterns: [
    'node_modules/(?!(module-that-needs-to-be-transformed)/)'
  ],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^@/(.*)$': '<rootDir>/$1'
  }
};

