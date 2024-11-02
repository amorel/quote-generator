#### 2. **User Service (`user-service/README.md`)**
# User Service

The User Service is responsible for managing user profiles, storing user-related data, and handling events associated with user actions. It uses an event-driven architecture with RabbitMQ to enable asynchronous updates and communication with other microservices.

## Table of Contents

- [User Service](#user-service)
  - [Table of Contents](#table-of-contents)
    - [Getting Started](#getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Endpoints](#endpoints)
    - [Event Subscriptions](#event-subscriptions)
    - [Testing](#testing)
    - [Architecture Overview](#architecture-overview)
      - [Event-Driven Architecture](#event-driven-architecture)
      - [Resilience and Scalability](#resilience-and-scalability)

### Getting Started

#### Prerequisites

- Node.js (>= 14.x)
- MongoDB instance
- RabbitMQ instance

#### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server in development mode:
   ```bash
   npm run dev
   ```

The service will be available at `http://localhost:3003`.

### Environment Variables

Create a `.env` file with the following variables:

```plaintext
MESSAGE_BROKER_URL=amqp://admin:password@rabbitmq:5672
PORT=3003
NODE_ENV=development
```

### Endpoints

- **GET** `/users`: Retrieve all users
- **GET** `/users/:id`: Get user profile by ID
- **PUT** `/users/:id`: Update user profile
- **GET** `/users/:id/favorites`: Get a user's favorite quotes
- **POST** `/users/:id/favorites/:quoteId`: Add a quote to a user's favorites
- **DELETE** `/users/:id/favorites/:quoteId`: Remove a quote from a user's favorites
- **GET** `/users/:id/preferences`: Get user preferences
- **PUT** `/users/:id/preferences`: Update user preferences

### Event Subscriptions

The User Service listens to various events via RabbitMQ, which allows for asynchronous processing of user actions. Below are the key events handled:

- **USER_CREATED**: Creates an initial user profile when a new user is registered.
- **USER_UPDATED**: Updates a user profile with new data from other services.
- **QUOTE_FAVORITED**: Adds a quote to a user’s list of favorites.

### Testing

To run tests:

```bash
npm test
```

### Architecture Overview

The User Service employs a modular design following domain-driven principles. It consists of:

- **Domain Layer**: Contains core business logic related to user management.
- **Application Layer**: Manages use cases and event handling.
- **Infrastructure Layer**: Handles database interaction with MongoDB and event handling via RabbitMQ.

#### Event-Driven Architecture

RabbitMQ is used for asynchronous communication between services. This enables the User Service to react to events from other services (e.g., authentication service, quote service) without direct coupling. The service listens to events related to user actions and performs updates based on the data received, ensuring data consistency and eventual synchronization across the system.

#### Resilience and Scalability

- **RabbitMQ with Retry Logic**: Ensures message delivery even in case of temporary network issues.
- **Dockerized Setup**: Allows for scalable deployments using Docker and Docker Compose.
- **Graceful Shutdown**: Ensures that RabbitMQ connections are properly closed on exit.

This setup enables the User Service to handle large volumes of user interactions efficiently and reliably.