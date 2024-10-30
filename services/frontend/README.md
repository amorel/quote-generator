#### 5. **Frontend Service (`frontend/README.md`)**

# Frontend Service

A React/TypeScript client application for interacting with the API, displaying quotes, and managing authentication.

## Table of Contents
- [Frontend Service](#frontend-service)
  - [Table of Contents](#table-of-contents)
    - [Getting Started](#getting-started)
      - [Prerequisites](#prerequisites)
      - [Installation](#installation)
    - [Environment Variables](#environment-variables)
    - [State Management](#state-management)
    - [Testing](#testing)
    - [Architecture Overview](#architecture-overview)

### Getting Started

#### Prerequisites
- Node.js (>= 14.x)

#### Installation

1. Install dependencies:
```bash
npm install
````

2. Start the app in development mode:
```bash
npm run dev
```

The app will be available at `http://localhost:3006`.

### Environment Variables

Create a `.env` file with:

```plaintext
VITE_API_URL=http://localhost:3000
```

### State Management

The app uses Redux Toolkit for global state management of quotes and authentication.

### Testing

To run tests:

```bash
npm test
```

### Architecture Overview

This frontend application follows modular component design principles, utilizing Redux for state management and TypeScript for type safety.
