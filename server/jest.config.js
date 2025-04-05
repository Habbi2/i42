module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  // Fix for Node.js built-in modules
  moduleNameMapper: {
    "^node:(.*)$": "<rootDir>/node_modules/$1"
  },
  // Transforms for ES modules if needed
  transform: {},
  // Explicitly tell Jest which directories to search for tests
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.js']
};