// services/auth-service/jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  coverageDirectory: "coverage",
  collectCoverageFrom: ["src/**/*.ts", "!src/index.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
  resetMocks: true,
  // Remplacer la configuration haste par :
  modulePathIgnorePatterns: ["<rootDir>/src/package.json"],
  watchPathIgnorePatterns: ["<rootDir>/src/package.json"],
  // Désactiver watchman
  watchman: false,
};
