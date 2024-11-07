FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 3003

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /build

# Copier les fichiers csproj et restaurer les dépendances
COPY ["src/UserService.API/UserService.API.csproj", "./UserService.API/"]
COPY ["src/UserService.Core/UserService.Core.csproj", "./UserService.Core/"]
COPY ["src/UserService.Infrastructure/UserService.Infrastructure.csproj", "./UserService.Infrastructure/"]
COPY ["src/UserService.Shared/UserService.Shared.csproj", "./UserService.Shared/"]
RUN dotnet restore "./UserService.API/UserService.API.csproj"

# Copier le reste des fichiers et build
COPY ./src ./
WORKDIR "/build/UserService.API"
RUN dotnet build "UserService.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "UserService.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "UserService.API.dll"]