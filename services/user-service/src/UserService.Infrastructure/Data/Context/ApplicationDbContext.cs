using Microsoft.EntityFrameworkCore;
using UserService.Core.Domain.Entities;
using UserService.Infrastructure.Data.Configurations;

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

            modelBuilder.ApplyConfiguration(new UserConfiguration());
            modelBuilder.ApplyConfiguration(new UserSettingsConfiguration());

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever(); // Important car nous utilisons des IDs externes
            });

            modelBuilder.Entity<FavoriteQuote>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.HasOne(e => e.User)
                    .WithMany()
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade) 
                    .IsRequired();
            });
        }
    }
}