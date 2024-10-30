# Microservices Project with JWT Authentication

This project transforms a monolithic architecture into a microservices-based solution, providing modularity, scalability, and security. The project includes services for authentication, user management, and quotes, orchestrated via an API Gateway and Docker Compose.

## Table of Contents

- [Microservices Project with JWT Authentication](#microservices-project-with-jwt-authentication)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Technologies](#technologies)
  - [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Services](#services)
    - [1. Auth Service](#1-auth-service)
    - [2. User Service](#2-user-service)
    - [3. Quote Service](#3-quote-service)
    - [4. API Gateway](#4-api-gateway)
  - [Authentication](#authentication)
  - [Microservices Architecture](#microservices-architecture)
  - [Security and Best Practices](#security-and-best-practices)
  - [License](#license)

## Project Structure

The project is organized as follows:

```plaintext
├── services/
│   ├── auth-service/
│   ├── user-service/
│   ├── quote-service/
│   └── api-gateway/
├── shared/                 # Shared modules (events, types, constants)
├── docker-compose.yml      # Docker Compose for service orchestration
└── README.md               # Project documentation
```

## Technologies

- **Node.js & TypeScript** - Service development
- **Fastify** - Lightweight API Gateway
- **Docker & Docker Compose** - Containerization and orchestration
- **MongoDB** - Database for each microservice
- **JWT & bcrypt** - Secure user authentication

## Setup

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/microservices-project.git
   cd microservices-project
   ```
2. Set up environment variables in `.env` files for each service (sample below for `auth-service`):

   ```plaintext
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=1h
   DB_CONNECTION=mongodb://auth-db:27017/auth
   ```
3. Build and start the services with Docker Compose:

   ```bash
   docker-compose up --build
   ```

   Each service will be available at its designated port (configured in `docker-compose.yml`).

## Services

### 1. Auth Service

- **Endpoints**: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`
- **Functionality**: Manages user authentication and generates JWT tokens.

### 2. User Service

- **Endpoints**: `/users` (accessible through the API Gateway)
- **Functionality**: Handles user data and profile management.

### 3. [Quote Service](./services/quote-service/README.md "Quote Service")

- **Endpoints**: `/quotes` (accessible through the API Gateway)
- **Functionality**: Manages quotes, requiring JWT token validation for access.

### 4. API Gateway

- **Functionality**: Provides a unified entry point and routes requests to each microservice. Configured using Fastify and includes middleware for initial token validation.

## Authentication

This project uses JSON Web Tokens (JWT) for user authentication. Here’s an overview of the authentication flow:

1. **Registration** (`/auth/register`): New users register with their email, password (hashed), and role.
2. **Login** (`/auth/login`): Users log in with email and password, receiving a JWT.
3. **Token Validation**: Each service validates tokens independently through middleware to ensure security.
4. **Role-Based Access Control**: Middleware checks user roles for authorized access.

## Microservices Architecture

The microservices architecture allows for scalability, fault isolation, and easier maintenance. Key components include:

1. **API Gateway**: Serves as the entry point and routes requests to each service.
2. **Service Discovery**: Uses Consul for service registration and load balancing.
3. **Event Bus**: Facilitates asynchronous communication between services (e.g., user updates).

## Security and Best Practices

1. **Secure JWT Authentication**: Password hashing with bcrypt, JWT for authentication, and role-based access control.
2. **Data Isolation**: Each service has a dedicated MongoDB instance, managed in Docker.
3. **Monitoring**: Health checks and centralized logging can be added to track service health.
4. **Scalability**: Stateless services allow for easy horizontal scaling.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
