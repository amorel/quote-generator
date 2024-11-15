# User Service

## Project Overview

The **User Service** is a modular web application developed using **ASP.NET Core** with a clean, scalable architecture. It manages user data, preferences, and interactions, providing a robust foundation for user-centric features such as personalized recommendations, activity tracking, and notifications. The service utilizes **PostgreSQL** for data persistence and integrates with **RabbitMQ** for message-based communication between services.

## Project Structure

The project follows the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**. The main components of the project structure are as follows:

```
user-service/
├── src/
│   ├── UserService.API                 # Presentation layer (REST API)
│   │   ├── Controllers/                # API controllers for handling HTTP requests
│   │   ├── Middleware/                 # Custom middleware
│   │   ├── Extensions/                 # Service configuration extensions
│   │   └── Program.cs                  # Application entry point
│   │
│   ├── UserService.Core                # Domain layer (core business logic)
│   │   ├── Domain/                     # Entities, value objects, and domain events
│   │   │   ├── Entities/               # Core domain entities
│   │   │   ├── ValueObjects/           # Value objects encapsulating key concepts
│   │   │   └── Events/                 # Domain events
│   │   ├── Interfaces/                 # Interfaces for ports (repositories, services)
│   │   └── Services/                   # Core business services
│   │
│   ├── UserService.Infrastructure      # Infrastructure layer (data access, messaging)
│   │   ├── Data/                       # Database context and configurations
│   │   │   ├── Context/                # EF Core DbContext
│   │   │   ├── Configurations/         # Entity configurations for EF Core
│   │   │   └── Migrations/             # Database migration scripts
│   │   ├── Messaging/                  # RabbitMQ communication services
│   │   └── Repositories/               # Repository implementations
│   │
│   └── UserService.Shared              # Shared DTOs and event definitions
│       ├── DTOs/                       # Data Transfer Objects for API and service interactions
│       └── Events/                     # Event definitions shared across services
│
└── tests/
    ├── UserService.UnitTests           # Unit tests for core logic
    └── UserService.IntegrationTests    # Integration tests for service interactions
```

## Key Features

- **User Profile Management**: Create, update, and retrieve user profiles.
- **Favorites Management**: Add and remove favorite items, and synchronize with related services.
- **Personalized Recommendations**: Provide customized suggestions based on user activity and preferences.
- **Notifications**: Send daily and weekly updates, with configurable notification preferences.
- **Analytics & History**: Track user interactions and generate activity statistics.
- **Message-Based Communication**: Use RabbitMQ for publishing and consuming domain events.

## Technologies Used

- **ASP.NET Core**: For building the web API.
- **Entity Framework Core**: For ORM and database interactions.
- **PostgreSQL**: For data persistence.
- **RabbitMQ**: For messaging and event-driven communication.
- **Dapper**: For advanced database queries.
- **Moq & xUnit**: For unit and integration testing.

## Prerequisites

- **.NET 7 SDK**
- **PostgreSQL** (Ensure a running instance with appropriate connection settings)
- **RabbitMQ** (Ensure a running instance with access credentials)
- **Docker** (optional for containerized deployment)

## Getting Started

1. **Configure the Application**:

   - Update `appsettings.json` and `appsettings.Development.json` with your PostgreSQL and RabbitMQ connection details.
2. **Run Database Migrations**:

   ```bash
   cd src/UserService.Infrastructure
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```
3. **Start the Application**:

   ```bash
   cd src/UserService.API
   dotnet run
   ```
4. **Run the Tests**:

   ```bash
   dotnet test
   ```

## Usage

Access the API at `http://localhost:5000` (or the port specified in your launch configuration). Use tools like **Postman** or **curl** to interact with the endpoints.

## Contributing

Feel free to submit issues or pull requests. For major changes, please discuss them in an issue first.

## License

This project is licensed under the MIT License. See `LICENSE` for more details.

---

**Note**: Ensure your database and RabbitMQ instances are up and running before starting the service for proper functionality.
