using Microsoft.EntityFrameworkCore;
using UserService.Core.Domain.Entities;

namespace UserService.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserSettings> UserSettings { get; set; }
    }
}