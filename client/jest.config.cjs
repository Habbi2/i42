// Note the extension .cjs for CommonJS format since your package.json has "type": "module"
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: [
    '/node_modules/(?!react-router|react-router-dom)/'
  ],
};