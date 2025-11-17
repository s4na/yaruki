module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.test.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  collectCoverageFrom: ['tests/**/*.test.js'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['js', 'json']
};
