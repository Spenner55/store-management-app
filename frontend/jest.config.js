/** @type {import('jest').Config} */
module.exports = {
  displayName: "client",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.(test|spec).{js,jsx,ts,tsx}", "**/*.(test|spec).{js,jsx,ts,tsx}"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  coverageDirectory: "<rootDir>/coverage",
};
