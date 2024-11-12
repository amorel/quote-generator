

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UserService.Core.Domain.Entities;

public class UserSettingsConfiguration : IEntityTypeConfiguration<UserSettings>
{
    public void Configure(EntityTypeBuilder<UserSettings> builder)
    {
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Id)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(s => s.UserId)
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(s => s.Theme)
            .HasMaxLength(20)
            .IsRequired();

        builder.HasIndex(s => s.UserId)
            .IsUnique();

        builder.HasOne(s => s.User)
            .WithOne()
            .HasForeignKey<UserSettings>(s => s.UserId);
    }
}