#### 1. **Auth Service (`auth-service/README.md`)**

# Auth Service

This service manages user authentication and authorization, including login, registration, and JWT generation.

## Table of Contents

- [Auth Service](#auth-service)
  - [Table of Contents](#table-of-contents)
    - [Getting Started](#getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [Endpoints](#endpoints)
    - [Testing](#testing)
    - [Architecture Overview](#architecture-overview)

### Getting Started

#### Prerequisites

- Node.js (>= 14.x)
- MongoDB instance

#### Installation

1. Install dependencies:
```bash
npm install
```


2. Start the server in development mode:
```bash
npm run dev
```

The service will run on `http://localhost:3001`.

### Environment Variables

Create a `.env` file with the following variables:

```plaintext
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
```

### Endpoints

- **POST** `/auth/register`: Registers a new user, hashes the password, and issues a JWT if successful.
- **POST** `/auth/login`: Logs in a user, validates credentials, and issues a JWT if successful.
- **POST** `/auth/validate`: Validates a given JWT token for session verification.

### Testing

To run tests:

```bash
npm test
```

### Architecture Overview

This service uses a clean architecture approach, with the following key components:

- **AuthService**: Manages core authentication functions, including user registration, login, and token validation.
- **User Repository**: `IUserRepository` interface abstracts data access, implemented using MongoDB through `UserModel`.
- **JWT Handling**: Token generation and validation are centralized in `AuthService`, using the `jwt.ts` configuration for consistency.
- **Security**: Passwords are hashed with bcrypt, and JWTs include user roles for access control.
