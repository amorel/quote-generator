CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

CREATE TABLE IF NOT EXISTS "Users" (
    "Id" uuid NOT NULL,
    "Email" character varying(256) NOT NULL,
    "Role" character varying(50) NOT NULL,
    CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "UserProfiles" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_UserProfiles" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_UserProfiles_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "UserPreferences" (
    "Id" uuid NOT NULL,
    "UserId" uuid NOT NULL,
    "Theme" character varying(20) NOT NULL,
    "DailyQuoteEnabled" boolean NOT NULL,
    "WeeklyDigestEnabled" boolean NOT NULL,
    CONSTRAINT "PK_UserPreferences" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_UserPreferences_Users_UserId" FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);