using Microsoft.EntityFrameworkCore;
using UserService.Infrastructure.Data;
using UserService.Core.Interfaces.Repositories;
using UserService.Infrastructure.Repositories;
using UserService.Infrastructure.Messaging;
using UserService.Core.Interfaces.Services;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using Prometheus;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
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

builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables();

// Configuration de la base de données
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        x => x.MigrationsAssembly("UserService.Infrastructure")
    ));

// Configuration des services
builder.Services.Configure<RabbitMQConfiguration>(
    builder.Configuration.GetSection("RabbitMQ"));
builder.Services.AddScoped<IMessageHandlerService, MessageHandlerService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService.Core.Services.UserService>();
builder.Services.AddSingleton<IMessageBusClient, RabbitMQClient>();
builder.Services.AddHostedService<RabbitMQConsumer>();

// Healthchecks
builder.Services.AddHealthChecks()
    .AddDbContextCheck<ApplicationDbContext>()
    .AddNpgSql(connectionString)
    .AddRabbitMQ(
        rabbitConnectionString: $"amqp://{builder.Configuration["RabbitMQ:Username"]}:{builder.Configuration["RabbitMQ:Password"]}@{builder.Configuration["RabbitMQ:Host"]}",
        name: "rabbitmq",
        failureStatus: HealthStatus.Unhealthy,
        tags: new[] { "rabbitmq" }
    );

var app = builder.Build();

// Configure middleware et routes
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "User Service API V1");
        c.RoutePrefix = string.Empty; // Pour servir l'UI à la racine
    });

    // En développement, on recrée la base à chaque démarrage
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            var logger = services.GetRequiredService<ILogger<Program>>();

            logger.LogInformation("Starting database migration...");

            await context.Database.EnsureDeletedAsync();
            await context.Database.EnsureCreatedAsync();

            // Ajout de données de test
            if (!await context.Users.AnyAsync())
            {
                await SeedTestData(context);
            }

            logger.LogInformation("Database migration completed successfully.");
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while migrating the database.");
            throw;
        }
    }
}
else
{
    // En production, on applique uniquement les migrations
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<ApplicationDbContext>();
            await context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred while migrating the database.");
            throw;
        }
    }
}

app.UseMetricServer();
app.UseHttpMetrics();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

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