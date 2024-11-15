export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "src"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "@quote-generator/shared": "<rootDir>/../../shared/src",
  },
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react-jsx",
        moduleResolution: "node",
      },
    },
  },
};
