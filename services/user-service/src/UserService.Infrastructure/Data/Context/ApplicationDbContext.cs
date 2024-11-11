using Microsoft.EntityFrameworkCore;
using UserService.Core.Domain.Entities;

namespace UserService.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        // Ajouter ce constructeur
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserSettings> UserSettings { get; set; }
        public DbSet<FavoriteQuote> FavoriteQuotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasKey(u => u.Id);

            modelBuilder.Entity<UserSettings>()
                .HasOne(s => s.User)
                .WithOne()
                .HasForeignKey<UserSettings>(s => s.UserId);

            modelBuilder.Entity<FavoriteQuote>()
                .HasKey(f => f.Id);

            modelBuilder.Entity<FavoriteQuote>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId);
        }
    }
}