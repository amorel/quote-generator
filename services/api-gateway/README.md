#### 4. **API Gateway (`api-gateway/README.md`)**

```markdown
# API Gateway

The API Gateway serves as a unified entry point for clients to interact with various microservices.

## Table of Contents
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Routing](#routing)
- [Testing](#testing)
- [Architecture Overview](#architecture-overview)

### Getting Started

#### Prerequisites
- Node.js (>= 14.x)

#### Installation

1. Install dependencies:
   ```bash
   npm install
````

2. Start the server in development mode:
   ```bash
   npm run dev
   ```

The gateway runs on `http://localhost:3000`.

### Environment Variables

Create a `.env` file with the following variables:

```plaintext
AUTH_SERVICE_URL=http://auth-service:3001
USER_SERVICE_URL=http://user-service:3003
QUOTE_SERVICE_URL=http://quote-service:3002
```

### Routing

The gateway routes requests to the respective services:

- `/auth/*` routes to the Auth Service
- `/users/*` routes to the User Service
- `/quotes/*` routes to the Quote Service

### Testing

To run tests:

```bash
npm test
```

### Architecture Overview

The API Gateway is built with Fastify and acts as a reverse proxy, handling authentication, routing, and request validation before directing traffic to the appropriate service.
