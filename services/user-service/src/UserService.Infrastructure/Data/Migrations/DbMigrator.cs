using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;

namespace UserService.Infrastructure.Data.Migrations
{
    public class DbMigrator
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<DbMigrator> _logger;

        public DbMigrator(
            ApplicationDbContext context,
            ILogger<DbMigrator> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task MigrateAsync()
        {
            try
            {
                _logger.LogInformation("Starting database migration...");
                await _context.Database.MigrateAsync();
                _logger.LogInformation("Database migration completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while migrating the database.");
                throw;
            }
        }
    }
}