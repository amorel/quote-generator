using Microsoft.EntityFrameworkCore;
using UserService.Infrastructure.Data;
using UserService.Core.Interfaces.Repositories;
using UserService.Infrastructure.Repositories;
using UserService.Infrastructure.Messaging;
using UserService.Core.Interfaces.Services;
using UserService.Core.Services;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.Design;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuration de la base de données
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        connectionString,
        x => x.MigrationsAssembly("UserService.Infrastructure")
    ));

// Configuration des services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService.Core.Services.UserService>();
builder.Services.AddSingleton<IMessageBusClient, RabbitMQClient>();

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
    app.UseSwaggerUI();

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

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.MapHealthChecks("/health");

app.Run();

// Méthode pour ajouter des données de test
static async Task SeedTestData(ApplicationDbContext context)
{
    var testUser = new UserService.Core.Domain.Entities.User
    {
        Id = Guid.NewGuid(),
        Email = "test@example.com",
        Username = "testuser",
        Role = "user"
    };

    var testAdmin = new UserService.Core.Domain.Entities.User
    {
        Id = Guid.NewGuid(),
        Email = "admin@example.com",
        Username = "admin",
        Role = "admin"
    };

    await context.Users.AddRangeAsync(testUser, testAdmin);

    var userSettings = new UserService.Core.Domain.Entities.UserSettings
    {
        Id = Guid.NewGuid(),
        UserId = testUser.Id,
        Theme = "light",
        EmailNotifications = true
    };

    var adminSettings = new UserService.Core.Domain.Entities.UserSettings
    {
        Id = Guid.NewGuid(),
        UserId = testAdmin.Id,
        Theme = "dark",
        EmailNotifications = true
    };

    await context.UserSettings.AddRangeAsync(userSettings, adminSettings);
    await context.SaveChangesAsync();
}

// Nécessaire pour les tests d'intégration
public partial class Program { }