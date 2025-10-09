/** @type {import('jest').Config} */
module.exports = {
  displayName: "server",
  testEnvironment: "node",
  roots: ["<rootDir>"],
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  coverageDirectory: "<rootDir>/coverage",
  setupFiles: ['<rootDir>/tests/setup.env.js'],
  clearMocks: true,
};
