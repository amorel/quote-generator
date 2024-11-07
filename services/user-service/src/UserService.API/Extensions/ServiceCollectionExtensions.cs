using Microsoft.EntityFrameworkCore;
using UserService.Infrastructure.Data;
using UserService.Infrastructure.Messaging;
using UserService.Core.Interfaces.Services;
using UserService.Core.Interfaces.Repositories;
using UserService.Infrastructure.Repositories;
using UserService.Core.Services;

namespace UserService.API.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Database
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(
                    configuration.GetConnectionString("DefaultConnection")));

            // RabbitMQ
            services.Configure<RabbitMQConfiguration>(
                configuration.GetSection("RabbitMQ"));
            services.AddHostedService<RabbitMQConsumer>();

            // Repositories and Services
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService.Core.Services.UserService>();

            return services;
        }
    }
}