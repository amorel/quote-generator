# Quotes API

### Running the Server

To start the server in development mode:

```bash
npm run dev
```

The server will be running at `http://localhost:3000`.

## Folder Structure

```
src
├── container.ts                # Dependency injection container
├── data
│   └── quotes.ts               # JSON data containing quotes
├── repositories
│   └── quote.repository.ts     # Repository for data access
├── services
│   └── quote.service.ts        # Service layer handling business logic
├── types
│   └── quote.ts                # Type definitions for Quote and QuoteFilters
└── index.ts                    # Main entry point for server setup, routes, and Swagger configuration
```

## Architecture Overview

The project follows a layered architecture with a clear separation of responsibilities:

1. **Repository Layer**: Manages data access and filtering (`quote.repository.ts`)
2. **Service Layer**: Contains business logic and interacts with the repository (`quote.service.ts`)
3. **Dependency Injection**: `container.ts` initializes and manages service instances for better modularity and testability
4. **API Routes**: Defined in `index.ts` using the services, providing endpoints for quote retrieval

This design improves scalability, testability, and flexibility. For example, the repository can be easily replaced to use a database instead of JSON files without changing the service or routes.

## Endpoints

### Health Check

- **GET** `/health`
  - Returns server status.

### Random Quotes

- **GET** `/quotes/random`
  - Retrieves random quotes with optional filters.

### Quote by ID

- **GET** `/quotes/:id`
  - Retrieves a specific quote by its ID.
  - **Parameters**:
    - `id` (string): The ID of the quote to retrieve.

## Quote Filters

The `/quotes/random` endpoint supports the following filters via query parameters:

| Filter        | Type   | Description                                           |
| ------------- | ------ | ----------------------------------------------------- |
| `limit`     | number | Maximum number of quotes to return                    |
| `maxLength` | number | Maximum length (character count) of quote content     |
| `minLength` | number | Minimum length (character count) of quote content     |
| `tags`      | string | Comma-separated tags (e.g.,`Success,Inspirational`) |
| `author`    | string | Author name (exact match, case-insensitive)           |

## Swagger Documentation

This project uses Swagger for automatically generated API documentation.

- After starting the server, you can access the Swagger UI at: `http://localhost:3000/documentation`
- The Swagger UI provides an interactive interface to test API endpoints, view request and response schemas, and explore all available parameters.

### Swagger Setup

Swagger is configured using Fastify plugins (`@fastify/swagger` and `@fastify/swagger-ui`). The documentation includes the following features:

- **Tags and Descriptions**: Organized by tags for clear navigation
- **Query Parameter Documentation**: Detailed parameter descriptions for each endpoint
- **Schemas**: Schemas for request validation and response types (e.g., `Quote`, `QuotesResponse`)

## Examples

- Get a random quote:
  ```
  GET http://localhost:3000/quotes/random
  ```
- Get two random quotes:
  ```
  GET http://localhost:3000/quotes/random?limit=2
  ```
- Get quotes with a maximum length of 100 characters:
  ```
  GET http://localhost:3000/quotes/random?maxLength=100
  ```
- Get quotes tagged as "Success":
  ```
  GET http://localhost:3000/quotes/random?tags=Success
  ```
- Get quotes by ID:
  ```
  GET http://localhost:3000/quotes/:id
  ```

## Future Improvements

- Add error handling and validation for query parameters
- Extend data with additional quotes and authors
- Implement pagination for large data sets
- Consider adding authentication for secured access

## License

This project is licensed under the MIT License. See `LICENSE` for more details.

## Acknowledgments

This project uses quotes data from a curated list for demonstration purposes.
