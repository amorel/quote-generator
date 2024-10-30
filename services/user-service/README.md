#### 2. **User Service (`user-service/README.md`)**

````markdown
# User Service

The User Service is responsible for managing user profiles and storing user data.

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
````

2. Start the server in development mode:
   ```bash
   npm run dev
   ```

The service will be available at `http://localhost:3003`.

### Environment Variables

Create a `.env` file with the following:

```plaintext
DB_CONNECTION=mongodb://user-db:27017/users
```

### Endpoints

- **GET** `/users`: Retrieve all users
- **GET** `/users/:id`: Get user profile by ID
- **PUT** `/users/:id`: Update user profile

### Testing

To run tests:

```bash
npm test
```

### Architecture Overview

The service uses a modular design, with dedicated layers for domain, application logic, and database interaction. MongoDB is used for persistence, and the service is designed to scale independently.
