# create-user-service.ps1

# Créer le dossier principal
Write-Host "Creating project structure..." -ForegroundColor Green
mkdir user-service
cd user-service

# Créer la solution
dotnet new sln --force

# Créer la structure des dossiers
$folders = @(
    "src/UserService.API/Controllers",
    "src/UserService.API/Properties",
    "src/UserService.Core/Domain",
    "src/UserService.Core/Interfaces",
    "src/UserService.Core/Services",
    "src/UserService.Infrastructure/Data",
    "src/UserService.Infrastructure/Messaging",
    "src/UserService.Infrastructure/Repositories",
    "src/UserService.Shared/DTOs",
    "src/UserService.Shared/Events",
    "tests/UserService.UnitTests",
    "tests/UserService.IntegrationTests"
)

foreach ($folder in $folders) {
    mkdir $folder -Force
}

# Créer les projets
Write-Host "Creating projects..." -ForegroundColor Green
dotnet new webapi -n UserService.API -o src/UserService.API
dotnet new classlib -n UserService.Core -o src/UserService.Core
dotnet new classlib -n UserService.Infrastructure -o src/UserService.Infrastructure
dotnet new classlib -n UserService.Shared -o src/UserService.Shared
dotnet new xunit -n UserService.UnitTests -o tests/UserService.UnitTests
dotnet new xunit -n UserService.IntegrationTests -o tests/UserService.IntegrationTests

# Ajouter les projets à la solution
Write-Host "Adding projects to solution..." -ForegroundColor Green
dotnet sln add src/UserService.API/UserService.API.csproj
dotnet sln add src/UserService.Core/UserService.Core.csproj
dotnet sln add src/UserService.Infrastructure/UserService.Infrastructure.csproj
dotnet sln add src/UserService.Shared/UserService.Shared.csproj
dotnet sln add tests/UserService.UnitTests/UserService.UnitTests.csproj
dotnet sln add tests/UserService.IntegrationTests/UserService.IntegrationTests.csproj

# Ajouter les références entre les projets
Write-Host "Setting up project references..." -ForegroundColor Green
dotnet add src/UserService.API/UserService.API.csproj reference src/UserService.Core/UserService.Core.csproj
dotnet add src/UserService.API/UserService.API.csproj reference src/UserService.Infrastructure/UserService.Infrastructure.csproj
dotnet add src/UserService.API/UserService.API.csproj reference src/UserService.Shared/UserService.Shared.csproj

dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj reference src/UserService.Core/UserService.Core.csproj
dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj reference src/UserService.Shared/UserService.Shared.csproj

dotnet add src/UserService.Core/UserService.Core.csproj reference src/UserService.Shared/UserService.Shared.csproj

dotnet add tests/UserService.UnitTests/UserService.UnitTests.csproj reference src/UserService.Core/UserService.Core.csproj
dotnet add tests/UserService.UnitTests/UserService.UnitTests.csproj reference src/UserService.Infrastructure/UserService.Infrastructure.csproj

dotnet add tests/UserService.IntegrationTests/UserService.IntegrationTests.csproj reference src/UserService.API/UserService.API.csproj

# Installer les packages NuGet
Write-Host "Installing NuGet packages..." -ForegroundColor Green

# Packages pour API
dotnet add src/UserService.API/UserService.API.csproj package Microsoft.AspNetCore.OpenApi
dotnet add src/UserService.API/UserService.API.csproj package Swashbuckle.AspNetCore
dotnet add src/UserService.API/UserService.API.csproj package Microsoft.EntityFrameworkCore.Design

# Packages pour Infrastructure (PostgreSQL)
dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj package Microsoft.EntityFrameworkCore.Tools
dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj package RabbitMQ.Client
dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj package Microsoft.Extensions.Configuration
dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj package Microsoft.Extensions.DependencyInjection
dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj package Microsoft.Extensions.Logging
dotnet add src/UserService.Infrastructure/UserService.Infrastructure.csproj package Dapper

# Packages pour Core
dotnet add src/UserService.Core/UserService.Core.csproj package Microsoft.Extensions.Logging.Abstractions

# Packages pour Tests
dotnet add tests/UserService.UnitTests/UserService.UnitTests.csproj package Moq
dotnet add tests/UserService.UnitTests/UserService.UnitTests.csproj package FluentAssertions
dotnet add tests/UserService.UnitTests/UserService.UnitTests.csproj package Microsoft.NET.Test.Sdk
dotnet add tests/UserService.UnitTests/UserService.UnitTests.csproj package xunit
dotnet add tests/UserService.UnitTests/UserService.UnitTests.csproj package xunit.runner.visualstudio
dotnet add tests/UserService.UnitTests/UserService.UnitTests.csproj package coverlet.collector

# Créer les fichiers de configuration
Write-Host "Creating configuration files..." -ForegroundColor Green
$appsettingsJson = @"
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=userservice;Username=postgres;Password=postgres"
  },
  "RabbitMQ": {
    "Host": "localhost",
    "Username": "admin",
    "Password": "password",
    "VirtualHost": "/"
  }
}
"@

$appsettingsDevJson = @"
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=userservice;Username=postgres;Password=postgres"
  },
  "RabbitMQ": {
    "Host": "localhost",
    "Username": "admin",
    "Password": "password",
    "VirtualHost": "/"
  }
}
"@

# Créer le fichier DbContext
$dbContextContent = @"
using Microsoft.EntityFrameworkCore;
using UserService.Core.Domain;

namespace UserService.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Configuration des entités à ajouter ici
        }
    }
}
"@

Set-Content -Path "src/UserService.API/appsettings.json" -Value $appsettingsJson
Set-Content -Path "src/UserService.API/appsettings.Development.json" -Value $appsettingsDevJson
Set-Content -Path "src/UserService.Infrastructure/Data/ApplicationDbContext.cs" -Value $dbContextContent

# Créer le fichier .gitignore
$gitignoreContent = @"
## Ignore Visual Studio temporary files, build results, and
## files generated by popular Visual Studio add-ons.

# User-specific files
*.suo
*.user
*.userosscache
*.sln.docstates

# Build results
[Dd]ebug/
[Dd]ebugPublic/
[Rr]elease/
[Rr]eleases/
x64/
x86/
build/
bld/
[Bb]in/
[Oo]bj/

# Visual Studio Code
.vscode/

# Visual Studio 
.vs/

# Rider
.idea/

# User-specific files
*.suo
*.user
*.userosscache
*.sln.docstates

# .NET Core
project.lock.json
project.fragment.lock.json
artifacts/

# Files built by Visual Studio
*_i.c
*_p.c
*_h.h
*.ilk
*.meta
*.obj
*.iobj
*.pch
*.pdb
*.ipdb
*.pgc
*.pgd
*.rsp
*.sbr
*.tlb
*.tli
*.tlh
*.tmp
*.tmp_proj
*_wpftmp.csproj
*.log
*.vspscc
*.vssscc
.builds
*.pidb
*.svclog
*.scc
"@

Set-Content -Path ".gitignore" -Value $gitignoreContent

Write-Host "Project creation completed!" -ForegroundColor Green
Write-Host "To start the project:" -ForegroundColor Cyan
Write-Host "cd src/UserService.API" -ForegroundColor Yellow
Write-Host "dotnet run" -ForegroundColor Yellow
Write-Host "To run tests:" -ForegroundColor Cyan
Write-Host "dotnet test" -ForegroundColor Yellow

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure your PostgreSQL connection string in appsettings.json" -ForegroundColor Yellow
Write-Host "2. Create initial migration:" -ForegroundColor Yellow
Write-Host "   cd src/UserService.Infrastructure" -ForegroundColor Yellow
Write-Host "   dotnet ef migrations add InitialCreate" -ForegroundColor Yellow
Write-Host "3. Update database:" -ForegroundColor Yellow
Write-Host "   dotnet ef database update" -ForegroundColor Yellow