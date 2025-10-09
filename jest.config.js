/** @type {import('jest').Config} */
const config = {

  projects: [
    "<rootDir>/backend/jest.config.js",
    "<rootDir>/frontend/jest.config.js",
  ],

  clearMocks: true,

  collectCoverage: true,

  coverageDirectory: "coverage",

  coverageProvider: "v8",

  passWithNoTests: true,

};

module.exports = config;
