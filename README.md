# Quote Generator - Microservices Architecture

A random quote generator based on a modern microservices architecture using Node.js, TypeScript and RabbitMQ.

## Overview

Built with a focus on scalability, reliability and performance, this application demonstrates modern backend development best practices including:

- Clean Architecture principles
- Domain-Driven Design
- Event-Driven Architecture
- SOLID principles
- Comprehensive testing
- Docker containerization

## Architecture

The application consists of several independent microservices:

- **API Gateway**: Single entry point for clients
- **Auth Service**: Authentication and JWT management
- **Quote Service**: Quote management and retrieval
- **User Service**: User profiles and preferences management
- **Frontend**: React user interface

### Service Communication

- Synchronous communication via HTTP/REST between services
- Asynchronous communication via RabbitMQ for events
- JWT for inter-service security

```plaintext
┌──────────┐     ┌──────────────┐
│          │     │              │
│ Frontend │─────▶ API Gateway │
│          │     │              │
└──────────┘     └──────┬───────┘
                        │
         ┌──────────────┼───────────────┐
         │              │               │
    ┌────▼────┐   ┌────▼─────┐     ┌────▼────┐
    │         │   │          │     │         │
    │  Auth   │   │  Quote   │     │  User   │
    │ Service │   │ Service  │     │ Service │
    │         │   │          │     │         │
    └────┬────┘   └────┬─────┘     └────┬────┘
         │             │                │
    ┌────▼─────────────▼────────────────▼───┐
    │                                       │
    │            Message Broker             │
    │             (RabbitMQ)                │
    │                                       │
    └───────────────────────────────────────┘
```

## Technology Stack

### Backend

- Node.js/TypeScript
- Fastify for REST APIs
- MongoDB for persistence
- RabbitMQ for event-driven architecture
- JWT for authentication

### Frontend

- React/TypeScript
- Redux Toolkit for state management
- React Router for navigation

### Infrastructure

- Docker & Docker Compose
- Jest & Supertest for testing
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js >= 20.x
- Docker & Docker Compose
- MongoDB
- RabbitMQ

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/quote-generator.git
cd quote-generator
```

2. Install dependencies:

```bash
npm install
```

3. Configuration:

- Copy `.env.example` to `.env`
- Adjust environment variables

4. Start services:

```bash
# Development mode
npm run dev

# Production mode
npm run prod
```

## Service Architecture

### 1. [API Gateway (Port 3000)](./services/api-gateway/README.md "API Gateway (Port 3000)")

- Single entry point
- Request routing
- JWT validation
- CORS configuration

### 2. [Auth Service (Port 3001)](./services/auth-service/README.md "Auth Service (Port 3001)")

- User registration/login
- JWT generation/validation
- User event publishing

### 3. [Quote Service (Port 3002)](./services/quote-service/README.md "Quote Service (Port 3002)")

- Quote CRUD operations
- Search and filtering
- Random quote generation
- Tags and categories

### 4. [User Service (Port 3003)](./services/user-service/README.md "User Service (Port 3003)")

- User profiles
- Reading preferences
- Favorite quotes
- Usage statistics

### 5. [Frontend (Port 3006)](./services/frontend/README.md "Frontend (Port 3006)")

- Modern React interface
- Redux state management
- Offline support
- Responsive design

## Event-Driven Architecture

The application leverages RabbitMQ for asynchronous service communication:

### User Events

- USER_CREATED
- USER_UPDATED
- USER_DELETED

### Quote Events

- QUOTE_VIEWED
- QUOTE_FAVORITED
- QUOTE_UNFAVORITED

## Testing

```bash
# Unit tests
npm run test

# Coverage report
npm run test:coverage 
```

## API Documentation

Swagger documentation is available at:

- Gateway: `/documentation`
- Auth: `/documentation`
- Quote: `/documentation`
- User: `/documentation`

## Environment Variables

Key environment variables needed:

```env
# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h

# Services URLs
AUTH_SERVICE_URL=http://localhost:3001
QUOTE_SERVICE_URL=http://localhost:3002
USER_SERVICE_URL=http://localhost:3003

# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017/quote_generator

# RabbitMQ
MESSAGE_BROKER_URL=amqp://guest:guest@localhost:5672
```

## Docker Support

Build and run with Docker Compose:

```bash
# Build services
docker-compose build

# Start services
docker-compose up

# Start services with build
docker-compose up --build

# Stop services
docker-compose down
```

## Accessing the Application

Once all services are running, you can access the application through your web browser:

[http://localhost:3006](http://localhost:3006 "Quote Generator")

[![Quote Generator Screenshot](./image/README/quote.png "Quote Generator Screenshot")](http://localhost:3006 "Quote Generator")

## Development

### Code Style

- ESLint for linting
- Prettier for code formatting
- Husky for pre-commit hooks

## Security

- JWT authentication
- Rate limiting
- CORS protection
- Input validation
- Security headers

## License

Distributed under the MIT License. See `LICENSE` for more information.
