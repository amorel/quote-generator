# User Service - Quote Generator

Service responsible for managing user profiles, preferences, and reading history for the Quote Generator application.

## Table of Contents

- [User Service - Quote Generator](#user-service---quote-generator)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture](#architecture)
    - [Event-Driven Architecture](#event-driven-architecture)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Installation](#installation)
  - [Event System](#event-system)
    - [Consumed Events](#consumed-events)
      - [User Events](#user-events)
      - [Quote Events](#quote-events)
  - [API Reference](#api-reference)
    - [User Profile Management](#user-profile-management)
      - [Get User Profile](#get-user-profile)
      - [Update User Preferences](#update-user-preferences)
      - [Manage Favorite Quotes](#manage-favorite-quotes)
  - [Data Models](#data-models)
    - [User Profile](#user-profile)
  - [Testing](#testing)
    - [Test Structure](#test-structure)
  - [Monitoring](#monitoring)
    - [Health Check](#health-check)
    - [Performance Metrics](#performance-metrics)
    - [RabbitMQ Monitoring](#rabbitmq-monitoring)
  - [Development](#development)
    - [Debug Mode](#debug-mode)
    - [Event Testing](#event-testing)
    - [Code Quality](#code-quality)
    - [Best Practices](#best-practices)
    - [Error Handling](#error-handling)

## Features

- 👤 User profile management
- ⭐ Favorite quotes handling
- 📊 Reading history tracking
- 🎯 Personalized recommendations
- 🔔 Notification preferences
- 📱 Theme preferences
- 📈 Usage statistics
- 🔄 Event-driven updates

## Architecture

### Event-Driven Architecture

```plaintext
┌──────────────┐         ┌──────────────┐
│              │         │              │
│ Auth Service │         │ Quote Service│
│              │         │              │
└───────┬──────┘         └──────┬───────┘
        │                       │
        │                       │
┌───────▼───────────────────────▼───────┐
│                                       │
│             Message Broker            │
│              (RabbitMQ)               │
│                                       │
└───────────────────┬───────────────────┘
                    │
            ┌───────▼───────┐
            │               │
            │ User Service  │
            │               │
            └───────┬───────┘
                    │
            ┌───────▼───────┐
            │               │
            │   MongoDB     │
            │               │
            └───────────────┘
```

## Getting Started

### Prerequisites
- Node.js >= 20.x
- MongoDB
- RabbitMQ

### Environment Variables
```env
NODE_ENV=development
PORT=3003
MONGODB_URI=mongodb://localhost:27017/users
MESSAGE_BROKER_URL=amqp://guest:guest@localhost:5672
RABBITMQ_HEARTBEAT=30
RABBITMQ_RECONNECT_INTERVAL=3000
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

## Event System

### Consumed Events

#### User Events
```typescript
interface UserCreatedEvent {
  type: "user.created";
  data: {
    userId: string;
    email: string;
    role: string;
    timestamp: number;
  }
}

interface UserUpdatedEvent {
  type: "user.updated";
  data: {
    userId: string;
    email: string;
    role: string;
    timestamp: number;
  }
}
```

#### Quote Events
```typescript
interface QuoteFavoritedEvent {
  type: "quote.favorited";
  data: {
    userId: string;
    quoteId: string;
    timestamp: number;
  }
}
```

## API Reference

### User Profile Management

#### Get User Profile
```http
GET /users/:id
```

Response:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "profile": {
    "name": "John Doe",
    "avatar": "avatar_url",
    "preferences": {
      "theme": "light",
      "notifications": {
        "dailyQuote": true,
        "weeklyDigest": true
      },
      "preferredTags": ["motivation", "success"],
      "favoriteAuthors": ["author_id"]
    },
    "stats": {
      "quotesViewed": 100,
      "favoriteCount": 25,
      "createdAt": "2024-02-21T10:00:00.000Z"
    }
  },
  "favoriteQuotes": ["quote_id1", "quote_id2"]
}
```

#### Update User Preferences
```http
PUT /users/:id/preferences
Content-Type: application/json

{
  "theme": "dark",
  "notifications": {
    "dailyQuote": true,
    "weeklyDigest": false
  }
}
```

#### Manage Favorite Quotes
```http
POST /users/:id/favorites/:quoteId
DELETE /users/:id/favorites/:quoteId
```

## Data Models

### User Profile
```typescript
interface UserProfile {
  id: string;
  email: string;
  role: string;
  profile: {
    name?: string;
    avatar?: string;
    preferences: UserPreferences;
    stats: UserStats;
  };
  favoriteQuotes: string[];
}

interface UserPreferences {
  theme: "light" | "dark";
  notifications: {
    dailyQuote: boolean;
    weeklyDigest: boolean;
  };
  preferredTags: string[];
  favoriteAuthors: string[];
}

interface UserStats {
  quotesViewed: number;
  favoriteCount: number;
  createdAt: Date;
}
```

## Testing

```bash
# Run tests
npm test

# Coverage report
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/
│   ├── services/
│   ├── repositories/
│   └── event-handlers/
├── integration/
│   └── user-profile.test.ts
└── mocks/
```

## Monitoring

### Health Check
```http
GET /health

Response:
{
  "status": "ok",
  "services": {
    "database": "connected",
    "messageQueue": "connected"
  },
  "timestamp": "2024-02-21T10:00:00.000Z"
}
```

### Performance Metrics
```http
GET /metrics

Response:
{
  "users": {
    "total": 1000,
    "active": 750
  },
  "events": {
    "processed": 5000,
    "failed": 10
  },
  "response_time": {
    "avg": 50,
    "p95": 150
  }
}
```

### RabbitMQ Monitoring
- Connection health
- Message processing rates
- Error rates
- Reconnection attempts

## Development

### Debug Mode
```bash
DEBUG=user-service:* npm run dev
```

### Event Testing
```bash
# Publish test event
npm run publish-event -- user.created

# Monitor event processing
npm run monitor-events
```

### Code Quality
- ESLint configuration
- Prettier formatting
- Jest tests
- TypeScript strict mode

### Best Practices
1. Event handling validation
2. Error retry policies
3. Graceful shutdowns
4. Transaction management
5. Event idempotency

### Error Handling
```typescript
class UserServiceError extends Error {
  constructor(
    message: string,
    public code: number,
    public details?: any
  ) {
    super(message);
  }
}

// Error response format
{
  status: "error",
  message: string,
  code: number,
  details?: any
}
```
