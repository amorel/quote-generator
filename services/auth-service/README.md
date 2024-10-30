#### 1. **Auth Service (`auth-service/README.md`)**

```markdown
# Auth Service

This service manages user authentication and authorization, including login, registration, and JWT generation.

## Table of Contents
- [Getting Started](#getting-started)
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
DB_CONNECTION=mongodb://auth-db:27017/auth
```

### Endpoints

- **POST** `/auth/register`: Register a new user
- **POST** `/auth/login`: Log in and receive a JWT token
- **POST** `/auth/validate`: Validate a JWT token

### Testing

To run tests:

```bash
npm test
```

### Architecture Overview

This service follows a clean architecture design, with separate layers for domain logic, infrastructure, and interface. It uses MongoDB for data persistence and bcrypt for password hashing.
