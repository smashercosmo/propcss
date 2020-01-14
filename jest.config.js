module.exports = {
  transform: {
    '.ts': require.resolve('ts-jest/dist'),
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|json)$'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts'],
  testMatch: ['<rootDir>/**/*.spec.ts'],
}