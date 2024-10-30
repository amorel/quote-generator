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
    - [Launching the Application](#launching-the-application)
  - [Services](#services)
    - [1. Auth Service](#1-auth-service)
    - [2. User Service](#2-user-service)
    - [3. Quote Service](#3-quote-service)
    - [4. API Gateway](#4-api-gateway)
  - [Testing the Endpoints](#testing-the-endpoints)
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

### Launching the Application

1. To build and start all services with Docker Compose, run:

   ```bash
   docker-compose up --build
   ```

   Each service will be available at its designated port as configured in `docker-compose.yml`.

2. To stop the containers, use:

   ```bash
   docker-compose down
   ```

## Services

### 1. Auth Service

- **Endpoints**: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`
- **Functionality**: Manages user authentication and generates JWT tokens.
- **URL**: `http://localhost:3001`

### 2. User Service

- **Endpoints**: `/users` (accessible through the API Gateway)
- **Functionality**: Handles user data and profile management.
- **URL**: `http://localhost:3003`

### 3. [Quote Service](./services/quote-service/README.md "Quote Service")

- **Endpoints**: `/quotes` (accessible through the API Gateway)
- **Functionality**: Manages quotes, requiring JWT token validation for access.
- **URL**: `http://localhost:3002`

### 4. API Gateway

- **Functionality**: Provides a unified entry point and routes requests to each microservice. Configured using Fastify and includes middleware for initial token validation.
- **URL**: `http://localhost:3000`

## Testing the Endpoints

Once the services are running, you can test the endpoints via API Gateway (`http://localhost:3000`). Below are some sample URLs and actions to test the functionalities:

1. **Registration**  
   - URL: `http://localhost:3000/auth/register`
   - Method: POST

2. **Login**  
   - URL: `http://localhost:3000/auth/login`
   - Method: POST

3. **Retrieve All Users**  
   - URL: `http://localhost:3000/users`
   - Method: GET

4. **Retrieve All Quotes**  
   - URL: `http://localhost:3000/quotes`
   - Method: GET

Ensure you provide the necessary authentication tokens for protected endpoints.

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