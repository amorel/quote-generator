export const APP_CONSTANTS = {
  VERSION: "1.0.0",
  ENVIRONMENT: process.env.NODE_ENV || "development",
  SERVICES: {
    AUTH: {
      NAME: "auth-service",
      DEFAULT_PORT: 3001,
    },
    QUOTE: {
      NAME: "quote-service",
      DEFAULT_PORT: 3002,
    },
    USER: {
      NAME: "user-service",
      DEFAULT_PORT: 3003,
    },
  },
} as const;
