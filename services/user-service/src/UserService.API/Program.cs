using Microsoft.EntityFrameworkCore;
using UserService.Infrastructure.Data;
using UserService.Core.Interfaces.Repositories;
using UserService.Infrastructure.Repositories;
using UserService.Infrastructure.Messaging;
using UserService.Core.Interfaces.Services;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using Prometheus;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// Logging configuration
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

// Configuration setup
builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// RabbitMQ Configuration validation
var rabbitConfig = builder.Configuration.GetSection("RabbitMQ").Get<RabbitMQConfiguration>();
if (rabbitConfig == null)
{
    throw new InvalidOperationException("RabbitMQ configuration is missing");
}
builder.Services.AddOptions<RabbitMQConfiguration>()
    .Bind(builder.Configuration.GetSection("RabbitMQ"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

// Base services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "User Service API",
        Version = "v1",
        Description = "User Service for Quote Generator"
    });
});

// Database configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Application services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService.Core.Services.UserService>();
builder.Services.AddScoped<IMessageHandlerService, MessageHandlerService>();

// Messaging services
try
{
    builder.Services.AddSingleton<IMessageBusClient, RabbitMQClient>();
    builder.Services.AddHostedService<RabbitMQConsumer>();
}
catch (Exception ex)
{
    var logger = LoggerFactory.Create(config => config.AddConsole())
        .CreateLogger("Program");
    logger.LogWarning(ex, "Failed to configure RabbitMQ services - messaging will be unavailable");
}

// Health checks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>(
        name: "database-context",
        failureStatus: HealthStatus.Degraded
    )
    .AddNpgSql(
        connectionString,
        name: "postgresql",
        failureStatus: HealthStatus.Degraded,
        tags: new[] { "database" }
    )
    .AddRabbitMQ(
        rabbitConnectionString: $"amqp://{rabbitConfig.Username}:{rabbitConfig.Password}@{rabbitConfig.Host}",
        name: "rabbitmq",
        failureStatus: HealthStatus.Degraded,
        tags: new[] { "messaging" }
    );

var app = builder.Build();

// Database initialization
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var logger = services.GetRequiredService<ILogger<Program>>();

        // Vérifie si la base existe, la crée si elle n'existe pas
        if (!await context.Database.CanConnectAsync())
        {
            logger.LogInformation("Database does not exist, creating...");
            await context.Database.EnsureCreatedAsync();

            // Ajoute des données de test uniquement si la base vient d'être créée
            if (!await context.Users.AnyAsync())
            {
                logger.LogInformation("Seeding initial data...");
                await SeedTestData(context);
            }
        }
        else
        {
            logger.LogInformation("Database already exists, checking for migrations...");
            if ((await context.Database.GetPendingMigrationsAsync()).Any())
            {
                logger.LogInformation("Applying pending migrations...");
                await context.Database.MigrateAsync();
            }
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while initializing the database");
        throw;
    }
}

// Middleware configuration
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "User Service API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseMetricServer();
app.UseHttpMetrics();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResultStatusCodes =
    {
        [HealthStatus.Healthy] = StatusCodes.Status200OK,
        [HealthStatus.Degraded] = StatusCodes.Status200OK,
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable
    }
});

app.Run();

// Méthode pour ajouter des données de test
static async Task SeedTestData(ApplicationDbContext context)
{
    try
    {
        // Création du user test
        var testUser = new UserService.Core.Domain.Entities.User
        {
            Id = "67321fac8a7cd9153616fd6a", // ID MongoDB pour correspondre avec l'auth-service
            Email = "test@example.com",
            Username = "testuser",
            Role = "user"
        };

        // Création de l'admin test
        var testAdmin = new UserService.Core.Domain.Entities.User
        {
            Id = "67321fac8a7cd9153616fd6b", // ID format MongoDB
            Email = "admin@example.com",
            Username = "admin",
            Role = "admin"
        };

        await context.Users.AddRangeAsync(testUser, testAdmin);

        // Création des settings
        var userSettings = new UserService.Core.Domain.Entities.UserSettings
        {
            Id = "settings-" + GenerateMongoId(), // ID format MongoDB
            UserId = testUser.Id,
            Theme = "light",
            EmailNotifications = true
        };

        var adminSettings = new UserService.Core.Domain.Entities.UserSettings
        {
            Id = "settings-" + GenerateMongoId(), // ID format MongoDB
            UserId = testAdmin.Id,
            Theme = "dark",
            EmailNotifications = true
        };

        await context.UserSettings.AddRangeAsync(userSettings, adminSettings);
        await context.SaveChangesAsync();

        Console.WriteLine("Test data seeded successfully.");
        Console.WriteLine($"Created test user with ID: {testUser.Id}");
        Console.WriteLine($"Created admin user with ID: {testAdmin.Id}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error seeding test data: {ex.Message}");
        throw;
    }
}

// Méthode helper pour générer un ID style MongoDB
static string GenerateMongoId()
{
    var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
    var random = new Random();
    var randomPart = random.Next(100000, 999999).ToString();
    return $"{timestamp}{randomPart}";
}

// Nécessaire pour les tests d'intégration
public partial class Program { }