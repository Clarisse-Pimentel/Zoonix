export default {
  transform: {
    '^.+\\.[jt]s$': 'babel-jest',
  },
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'controllers/**/*.mjs',
    '!**/node_modules/**',
  ],
};
