# API Gateway - Quote Generator

Unified entry point for the Quote Generator application, handling request routing, authentication, and inter-service communication.

## Table of Contents

- [API Gateway - Quote Generator](#api-gateway---quote-generator)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
  - [Configuration](#configuration)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Routes](#routes)
  - [Security](#security)
    - [Authentication](#authentication)
    - [Protection](#protection)
    - [Error Handling](#error-handling)
  - [Testing](#testing)
  - [Monitoring](#monitoring)
    - [Health Check](#health-check)
    - [Metrics](#metrics)
    - [Logging](#logging)
  - [API Documentation](#api-documentation)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Debugging](#debugging)
    - [Health Checks](#health-checks)

## Features

- ✨ Single entry point for all services
- 🔒 Centralized authentication management
- 🛣️ Intelligent service routing
- 📝 Request logging
- 🔍 Service health checks
- 🌐 Configurable CORS
- 📊 Performance monitoring
- ⚡ Load balancing

## Architecture

```plaintext
                                  ┌─────────────────┐
                                  │                 │
          ┌──────────────────────▶│  Auth Service   │
          │                       │   (Port 3001)   │
          │                       └─────────────────┘
┌──────────────────┐             ┌─────────────────┐
│                  │             │                 │
│    API Gateway   │────────────▶│  Quote Service  │
│    (Port 3000)   │             │   (Port 3002)   │
│                  │             └─────────────────┘
└──────────────────┘              ┌─────────────────┐
          │                       │                 │
          └──────────────────────▶│  User Service   │
                                  │   (Port 3003)   │
                                  └─────────────────┘
```

## Configuration

Environment variables:

```env
AUTH_SERVICE_URL=http://localhost:3001
QUOTE_SERVICE_URL=http://localhost:3002
USER_SERVICE_URL=http://localhost:3003
PORT=3000
NODE_ENV=development
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Build:
```bash
npm run build
```

3. Start service:
```bash
# Development
npm run dev

# Production
npm start
```

## Usage

Service available at `http://localhost:3000`

## Routes

| Route          | Service        | Description                   | Authentication |
|----------------|----------------|-------------------------------|----------------|
| `/auth/*`      | Auth Service   | Authentication routes         | No            |
| `/quotes/*`    | Quote Service  | Quote management             | Yes           |
| `/users/*`     | User Service   | User management              | Yes           |
| `/health`      | API Gateway    | Service status               | No            |
| `/metrics`     | API Gateway    | Performance metrics          | Yes           |

## Security

### Authentication
- JWT validation on protected routes
- Token format:
```
Authorization: Bearer <jwt_token>
```

### Protection
- Rate limiting per IP/user
- CORS configuration
- Security headers (Helmet)
- Request validation

### Error Handling
```typescript
{
  status: "error",
  message: string,
  code: number,
  details?: any
}
```

## Testing

```bash
# Run tests
npm test

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

Example test:
```typescript
describe('API Gateway', () => {
  it('should proxy requests to correct service', async () => {
    const response = await request(app)
      .get('/quotes/random')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });
});
```

## Monitoring

### Health Check
Endpoint: `/health`

Response format:
```json
{
  "status": "ok",
  "services": {
    "auth": "healthy",
    "quote": "healthy",
    "user": "healthy"
  },
  "timestamp": "2024-02-21T10:00:00.000Z"
}
```

### Metrics
- Request count
- Response times
- Error rates
- Service availability

### Logging
- Request/response logging
- Error logging
- Performance logging

## API Documentation

Swagger documentation available at:
```
http://localhost:3000/documentation
```

Features:
- Interactive API testing
- Request/response examples
- Authentication documentation
- Schema definitions

## Troubleshooting

### Common Issues

1. **Service Unavailable**
   - Check service URLs in `.env`
   - Verify services are running
   - Check container logs: `docker-compose logs api-gateway`

2. **Authentication Errors**
   - Verify JWT token
   - Check Auth service configuration
   - Review auth logs

3. **Performance Issues**
   - Check `/metrics` endpoint
   - Monitor service response times
   - Review connection pool settings

### Debugging

Enable debug logs:
```env
DEBUG=api-gateway:*
```

Monitor service logs:
```bash
npm run logs
```

### Health Checks

Manual service check:
```bash
curl http://localhost:3000/health
```

Monitor all services:
```bash
./test-connections.sh
```
