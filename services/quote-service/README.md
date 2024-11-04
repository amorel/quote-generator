# Quote Service - Quote Generator

Service responsible for managing quotes, providing random quote generation, filtering, and categorization capabilities.

## Table of Contents

- [Quote Service - Quote Generator](#quote-service---quote-generator)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
    - [Clean Architecture Implementation](#clean-architecture-implementation)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Installation](#installation)
  - [API Reference](#api-reference)
    - [Get Random Quotes](#get-random-quotes)
    - [Get Quote by ID](#get-quote-by-id)
    - [Get All Tags](#get-all-tags)
    - [Get All Authors](#get-all-authors)
  - [Data Models](#data-models)
    - [Quote Entity](#quote-entity)
    - [Author Entity](#author-entity)
    - [Tag Entity](#tag-entity)
  - [Filtering System](#filtering-system)
    - [Tag Filtering](#tag-filtering)
    - [Length Filtering](#length-filtering)
    - [Author Filtering](#author-filtering)
  - [Testing](#testing)
    - [Test Structure](#test-structure)
  - [Error Handling](#error-handling)
    - [Error Types](#error-types)
    - [Error Responses](#error-responses)
  - [Performance](#performance)
    - [Caching Strategy](#caching-strategy)
    - [Query Optimization](#query-optimization)
    - [Rate Limiting](#rate-limiting)
  - [Documentation](#documentation)
    - [Swagger Documentation](#swagger-documentation)
    - [API Examples](#api-examples)
      - [Get Random Motivational Quote](#get-random-motivational-quote)
      - [Get Multiple Success Quotes](#get-multiple-success-quotes)
    - [Monitoring](#monitoring)
    - [Debug Mode](#debug-mode)
    - [Performance Metrics](#performance-metrics)

## Features

- 🎲 Random quote generation
- 🔍 Advanced filtering capabilities
- 🏷️ Tag and category management
- 📚 Author management
- 🔄 Quote caching
- 📊 Quote statistics
- 🎯 Smart quote selection
- 🚀 High performance design

## Architecture

### Clean Architecture Implementation

```plaintext
src/
├── application/           # Application business rules
│   ├── use-cases/        # Use case implementations
│   └── dtos/             # Data Transfer Objects
├── domain/               # Enterprise business rules
│   ├── entities/         # Domain entities
│   ├── repositories/     # Repository interfaces
│   └── value-objects/    # Value objects
├── infrastructure/       # External interfaces
│   ├── persistence/      # Database implementations
│   └── repositories/     # Repository implementations
└── interface/           # Interface adapters
    ├── api/             # REST API controllers
    └── presenters/      # Data presenters
```

## Getting Started

### Prerequisites
- Node.js >= 20.x
- MongoDB
- RabbitMQ (for events)

### Environment Variables
```env
NODE_ENV=development
PORT=3002
MONGODB_URI=mongodb://localhost:27017/quotes
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

## API Reference

### Get Random Quotes
```http
GET /quotes/random
```

Query Parameters:
```typescript
interface QueryParams {
  limit?: number;      // default: 1, max: 50
  maxLength?: number;  // maximum quote length
  minLength?: number;  // minimum quote length
  tags?: string;       // comma-separated tags
  author?: string;     // author name/slug
}
```

Response:
```json
[
  {
    "_id": "quote_id",
    "content": "Quote content",
    "author": "Author name",
    "tags": ["tag1", "tag2"]
  }
]
```

### Get Quote by ID
```http
GET /quotes/:id
```

### Get All Tags
```http
GET /tags
```

### Get All Authors
```http
GET /authors
```

## Data Models

### Quote Entity
```typescript
interface Quote {
  id: string;
  content: QuoteContent;  // Value Object
  authorId: string;
  tags: string[];
}
```

### Author Entity
```typescript
interface Author {
  id: string;
  name: AuthorName;    // Value Object
  link?: string;
  bio: string;
  description: string;
}
```

### Tag Entity
```typescript
interface Tag {
  id: string;
  name: TagName;       // Value Object
}
```

## Filtering System

### Tag Filtering
- AND operation: `tags=motivation,success`
- OR operation: `tags=motivation|success`

### Length Filtering
```typescript
interface LengthFilter {
  minLength?: number;
  maxLength?: number;
}
```

### Author Filtering
- Exact match: `author=Albert Einstein`
- Slug match: `author=albert-einstein`

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific tests
npm test -- quote.test.ts
```

### Test Structure
```
tests/
├── unit/
│   ├── application/
│   ├── domain/
│   └── infrastructure/
├── integration/
│   └── api.test.ts
└── mocks/
```

## Error Handling

### Error Types
```typescript
class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
```

### Error Responses
```json
{
  "status": "error",
  "message": "Error description",
  "code": 404,
  "details": {}
}
```

## Performance

### Caching Strategy
- In-memory cache for frequent quotes
- MongoDB indexing for efficient queries
- Optimized random selection

### Query Optimization
```typescript
// Efficient random quote selection
db.quotes.aggregate([
  { $match: filters },
  { $sample: { size: limit } }
]);
```

### Rate Limiting
```typescript
{
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}
```

## Documentation

### Swagger Documentation
Available at: `http://localhost:3002/documentation`

### API Examples

#### Get Random Motivational Quote
```bash
curl "http://localhost:3002/quotes/random?tags=motivation&maxLength=200"
```

#### Get Multiple Success Quotes
```bash
curl "http://localhost:3002/quotes/random?tags=success&limit=5"
```

### Monitoring

Health Check Endpoint:
```http
GET /health

Response:
{
  "status": "ok",
  "timestamp": "2024-02-21T10:00:00.000Z",
  "version": "1.0.0",
  "database": "connected"
}
```

### Debug Mode
```bash
DEBUG=quote-service:* npm run dev
```

### Performance Metrics
```http
GET /metrics

Response:
{
  "quotes": {
    "total": 1000,
    "cached": 100
  },
  "requests": {
    "total": 5000,
    "success": 4950,
    "error": 50
  },
  "response_time": {
    "avg": 45,
    "p95": 100,
    "p99": 200
  }
}
```
