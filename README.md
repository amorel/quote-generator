# Quote Generator - Microservices Architecture

###### A modern quote generator built with microservices architecture, demonstrating best practices in web development. Built with Node.js, ASP.NET Core, TypeScript, React, Fastify, MongoDB, PostgreSQL, RabbitMQ, and Docker. Features include: Clean Architecture, DDD, Event-Driven Architecture, CQRS, automated testing, and comprehensive API documentation.

![Microservices Architecture](./image/README/architecture.png "Microservices Architecture")

## Overview

Built with a focus on scalability, reliability and performance, this application demonstrates modern backend development best practices including:

- Clean Architecture principles
- Domain-Driven Design
- Event-Driven Architecture
- SOLID principles
- Comprehensive testing
- Docker containerization

## 🛠 Tech Stack

### Backend Services
- **Auth Service**: Node.js + TypeScript + Fastify + MongoDB
- **Quote Service**: Node.js + TypeScript + Fastify + MongoDB
- **User Service**: ASP.NET Core 8.0 + PostgreSQL
- **API Gateway**: Node.js + TypeScript + Fastify

### Frontend
- **Framework**: React 18
- **State Management**: Redux Toolkit
- **Styling**: CSS Modules
- **Build Tool**: Vite

### Infrastructure
- **Message Broker**: RabbitMQ
- **Databases**: 
  - MongoDB (Auth & Quotes)
  - PostgreSQL (Users)
- **Containerization**: Docker + Docker Compose
- **API Documentation**: Swagger/OpenAPI

## 🏗 Architecture & Patterns

### Clean Architecture
- Domain Layer (Entities, Value Objects)
- Application Layer (Use Cases, DTOs)
- Infrastructure Layer (Repositories, External Services)
- Interface Layer (Controllers, Presenters)

### Domain-Driven Design (DDD)
- Bounded Contexts
- Aggregates
- Value Objects
- Domain Events
- Repository Pattern

### Event-Driven Architecture
- Asynchronous Communication
- Message Queues
- Event Publishing/Subscription
- Event Sourcing

### CQRS (Command Query Responsibility Segregation)
- Separate Command and Query Models
- Optimized Read/Write Operations

## 🔧 Design Patterns
- Repository Pattern
- Factory Pattern
- Strategy Pattern
- Observer Pattern
- Circuit Breaker
- Retry Pattern
- Decorator Pattern

## 🏭 CI/CD & DevOps
- GitHub Actions
- Docker Containerization
- Infrastructure as Code
- Automated Testing
- Continuous Integration
- Continuous Deployment

## 📊 Testing Strategies
- Unit Tests (Jest, xUnit)
- Integration Tests
- E2E Tests
- Test Coverage Reports
- Mocking & Stubbing

## 🛡 Security
- JWT Authentication
- Role-Based Access Control
- API Gateway Security
- Input Validation
- Rate Limiting
- CORS Configuration

## 🎯 Best Practices

### Code Quality
- TypeScript for Type Safety
- ESLint & Prettier
- SOLID Principles
- Clean Code Practices
- Code Reviews
- Documentation

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

#### Authentication process and retrieval of a quote
```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant AuthService
    participant QuoteService
    participant UserService
    participant RabbitMQ

    Client->>Gateway: POST /auth/login
    Gateway->>AuthService: Forward login request
    AuthService->>AuthService: Validate credentials
    AuthService-->>Gateway: Return JWT token
    Gateway-->>Client: Return JWT token

    Client->>Gateway: GET /quotes/random (with JWT)
    Gateway->>Gateway: Validate JWT
    Gateway->>QuoteService: Forward request
    QuoteService->>QuoteService: Generate random quote
    QuoteService->>RabbitMQ: Publish quote.viewed event
    QuoteService-->>Gateway: Return quote
    Gateway-->>Client: Return quote

    RabbitMQ->>UserService: Consume quote.viewed event
    UserService->>UserService: Update user history
```

### Add to Favorites process
```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant QuoteService
    participant UserService
    participant RabbitMQ

    Client->>Gateway: POST /quotes/:id/favorite
    Gateway->>Gateway: Validate JWT
    Gateway->>QuoteService: Forward favorite request
    QuoteService->>RabbitMQ: Publish quote.favorited event
    QuoteService-->>Gateway: Return success
    Gateway-->>Client: Return success

    RabbitMQ->>UserService: Consume quote.favorited event
    UserService->>UserService: Add to favorites
    UserService->>UserService: Update user stats
```

### New user registration process
```mermaid
sequenceDiagram
    participant Client
    participant Gateway
    participant AuthService
    participant UserService
    participant RabbitMQ

    Client->>Gateway: POST /auth/register
    Gateway->>AuthService: Forward register request
    AuthService->>AuthService: Validate input
    AuthService->>AuthService: Hash password
    AuthService->>AuthService: Create user
    AuthService->>RabbitMQ: Publish user.created event
    AuthService-->>Gateway: Return success + JWT
    Gateway-->>Client: Return success + JWT

    RabbitMQ->>UserService: Consume user.created event
    UserService->>UserService: Create user profile
    UserService->>UserService: Initialize preferences
```

## Getting Started

### Prerequisites

- Node.js >= 20.x
- Docker & Docker Compose

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
