# Auth Service - Quote Generator

Authentication and authorization service for the Quote Generator application, handling user registration, login, and JWT token management.

## Table of Contents

- [Auth Service - Quote Generator](#auth-service---quote-generator)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
    - [Clean Architecture Implementation](#clean-architecture-implementation)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Installation](#installation)
  - [API Endpoints](#api-endpoints)
    - [Authentication Routes](#authentication-routes)
      - [Register User](#register-user)
      - [Login User](#login-user)
      - [Validate Token](#validate-token)
  - [Event System](#event-system)
    - [Published Events](#published-events)
  - [Security](#security)
    - [Password Hashing](#password-hashing)
    - [JWT Configuration](#jwt-configuration)
    - [Token Validation](#token-validation)
  - [Testing](#testing)
    - [Test Structure](#test-structure)
  - [API Documentation](#api-documentation)
  - [Error Handling](#error-handling)
    - [Error Types](#error-types)
    - [Error Responses](#error-responses)
  - [Monitoring](#monitoring)
    - [Health Check](#health-check)
    - [Metrics](#metrics)
  - [Development](#development)
    - [Code Style](#code-style)
    - [Debugging](#debugging)
    - [Best Practices](#best-practices)

## Features

- 🔐 User authentication (login/register)
- 🎟️ JWT token generation & validation
- 📨 Event publishing for user actions
- 🔄 Token refresh mechanism
- 🚪 Role-based access control
- 📝 Clean architecture implementation
- ⚡ High-performance token validation
- 🔍 Comprehensive error handling

## Architecture

### Clean Architecture Implementation

```plaintext
┌───────────────────────────────────────────────────┐
│                    Interface Layer                │
│                                                   │
│    ┌──────────────┐  ┌────────────┐               │
│    │ Controllers  │  │ Presenters │               │
│    └──────────────┘  └────────────┘               │
├───────────────────────────────────────────────────┤
│                  Application Layer                │
│                                                   │
│    ┌──────────────┐  ┌────────────┐               │
│    │  Use Cases   │  │    DTOs    │               │
│    └──────────────┘  └────────────┘               │
├───────────────────────────────────────────────────┤
│                   Domain Layer                    │
│                                                   │
│    ┌──────────────┐  ┌────────────┐               │
│    │   Entities   │  │ Repository │               │
│    └──────────────┘  │ Interfaces │               │
│                      └────────────┘               │
├───────────────────────────────────────────────────┤
│               Infrastructure Layer                │
│                                                   │
│    ┌──────────────┐  ┌────────────┐               │
│    │  MongoDB     │  │ RabbitMQ   │               │
│    │ Repositories │  │  Events    │               │
│    └──────────────┘  └────────────┘               │
└───────────────────────────────────────────────────┘
```

## Getting Started

### Prerequisites
- Node.js >= 20.x
- MongoDB
- RabbitMQ

### Environment Variables
```env
NODE_ENV=development
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
PORT=3001
MONGODB_URI=mongodb://localhost:27017/auth
MESSAGE_BROKER_URL=amqp://guest:guest@localhost:5672
```

### Installation

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

## API Endpoints

### Authentication Routes

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt.token.here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "user"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Validate Token
```http
POST /auth/validate
Authorization: Bearer <token>
```

## Event System

### Published Events

```typescript
// User Created Event
{
  type: "user.created",
  data: {
    userId: string,
    email: string,
    role: string,
    timestamp: number
  }
}

// User Updated Event
{
  type: "user.updated",
  data: {
    userId: string,
    email: string,
    role: string,
    timestamp: number
  }
}
```

## Security

### Password Hashing
- bcrypt for password hashing
- Configurable salt rounds
- Password validation rules

### JWT Configuration
```typescript
{
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN,
  algorithm: 'HS256'
}
```

### Token Validation
- Signature verification
- Expiration checking
- Role validation

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm test -- auth.test.ts
```

### Test Structure
```
tests/
├── unit/
│   ├── services/
│   ├── controllers/
│   └── repositories/
├── integration/
│   └── auth.test.ts
└── mocks/
```

## API Documentation

Swagger documentation available at:
```
http://localhost:3001/documentation
```

## Error Handling

### Error Types
```typescript
class AppError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}
```

### Error Responses
```json
{
  "status": "error",
  "message": "Error message",
  "code": 400,
  "details": {}
}
```

## Monitoring

### Health Check
```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2024-02-21T10:00:00.000Z",
  "services": {
    "database": "connected",
    "messageQueue": "connected"
  }
}
```

### Metrics
- Authentication success/failure rates
- Token validation performance
- Database connection status
- Message queue health

## Development

### Code Style
- ESLint configuration
- Prettier formatting
- TypeScript strict mode

### Debugging
```bash
# Debug mode
DEBUG=auth-service:* npm run dev

# Detailed logging
LOG_LEVEL=debug npm run dev
```

### Best Practices
- Repository pattern
- Dependency injection
- SOLID principles
- Comprehensive testing
- Error handling
