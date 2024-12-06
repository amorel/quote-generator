import mongoose, { Connection, ConnectOptions } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

// Configuration par défaut pour les différents environnements
const config = {
  development: {
    username: "admin",
    password: "password",
    host: "localhost",
    port: "27018",
    database: "auth",
    options: "?authSource=admin",
  },
  production: {
    username: "admin",
    password: "password",
    host: "auth-db",
    port: "27017",
    database: "auth",
    options: "?authSource=admin",
  },
  test: {
    username: "admin",
    password: "password",
    host: "localhost",
    port: "27018",
    database: "auth_test",
    options: "?authSource=admin",
  },
};

type EnvironmentKey = keyof typeof config;

let mongoConnection: Connection | null = null;
let lastError: Error | null = null;

export async function connectDB() {
  try {
    console.log("=== START DEBUG INFO ===\n");
    console.log(`NODE_ENV: ${process.env.NODE_ENV}\n`);
    console.log(`MONGO_PORT: ${process.env.MONGO_PORT}\n`);
    console.log(`MONGO_HOST_AUTH: ${process.env.MONGO_HOST_AUTH}\n`);
    console.log(`MONGO_DATABASE_AUTH: ${process.env.MONGO_DATABASE_AUTH}\n`);
    console.log(`MONGO_ROOT_USERNAME: ${process.env.MONGO_ROOT_USERNAME}\n`);
    console.log(
      "Config:",
      config[(process.env.NODE_ENV as EnvironmentKey) || "development"]
    );
    console.log("================================");
    // Si on est en environnement de test et qu'on veut utiliser une BD en mémoire
    if (
      process.env.NODE_ENV === "test" &&
      process.env.USE_MEMORY_DB === "true"
    ) {
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();

      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      mongoConnection = mongoose.connection;
      console.log("✅ Connected to MongoDB Memory Server");
      return;
    }
    // Détermine l'environnement
    const env = (process.env.NODE_ENV || "development") as EnvironmentKey;
    const envConfig = config[env];

    console.log("Current config:\n");
    console.log(JSON.stringify(config[env], null, 2) + "\n");

    // Récupère les variables d'environnement ou utilise les valeurs par défaut
    const username =
      process.env.MONGO_INITDB_ROOT_USERNAME || envConfig.username;
    const password =
      process.env.MONGO_INITDB_ROOT_PASSWORD || envConfig.password;
    const host = process.env.MONGO_HOST_AUTH || envConfig.host;
    const port = process.env.MONGO_PORT || envConfig.port;
    console.log(`Final values:\n`);
    console.log(`host: ${host}\n`);
    console.log(`port: ${port}\n`);
    const database = process.env.MONGO_DATABASE_AUTH || envConfig.database;
    const options = process.env.MONGO_OPTIONS || envConfig.options;

    console.log("Debug - Variables for URI construction:", {
      username,
      // password: '<hidden>',
      host,
      port,
      database,
      options,
      env,
      envConfig,
    });
    // Construit l'URI de connexion
    const uri = `mongodb://${username}:${password}@${host}:${port}/${database}${options}`;
    console.log(
      "Debug - Final URI:",
      uri.replace(/\/\/.*@/, "//<credentials>@")
    );
    console.log(`Debug - Final URI: ${uri.replace(/\/\/.*@/, "//<credentials>@")}\n`);
    console.log("=== END DEBUG INFO ===\n");

    // Configure Mongoose
    mongoose.set("strictQuery", true);

    // Options de connexion
    const mongooseOptions: ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    // Tentative de connexion
    await mongoose.connect(uri, mongooseOptions);
    mongoConnection = mongoose.connection;

    // Log de succès
    console.log(`✅ Connected to MongoDB (${env} environment)`);
    console.log(`📦 Database: ${database}`);
    console.log(`🖥️  Host: ${host}:${port}`);

    console.log(
      "Attempting to connect to MongoDB with URI:",
      uri.replace(/\/\/.*@/, "//<credentials>@")
    );
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Connection options:", mongooseOptions);

    // Gestion des événements de connexion
    mongoConnection.on("error", (error: Error) => {
      lastError = error;
      console.error("❌ MongoDB connection error (On):", error);
    });

    mongoConnection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected");
    });

    mongoConnection.on("reconnected", () => {
      lastError = null;
      console.log("✅ MongoDB reconnected");
    });

    // Gestion propre de la fermeture
    process.on("SIGINT", async () => {
      try {
        if (mongoConnection) {
          await mongoConnection.close();
          console.log("MongoDB connection closed through app termination");
        }
        process.exit(0);
      } catch (err) {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    lastError = error instanceof Error ? error : new Error("Unknown error");

    console.error("❌ MongoDB connection error (Catch):");
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : "Unknown error type",
    });

    if (process.env.NODE_ENV === "development") {
      console.error("Full error object:", error);
    }

    setTimeout(() => {
      process.exit(1);
    }, 5000);
  }
}

// Fonction utilitaire pour tester la connexion
export async function testConnection(): Promise<boolean> {
  try {
    if (!mongoConnection) {
      return false;
    }

    if (mongoConnection.readyState === 1) {
      const db = mongoConnection.db;
      if (db) {
        const admin = db.admin();
        await admin.ping();
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Database ping failed:", error);
    return false;
  }
}

// Type pour l'état de la connexion
export interface ConnectionState {
  isConnected: boolean;
  readyState: number;
  error: Error | null;
}

// Fonction pour obtenir l'état actuel de la connexion
export function getConnectionState(): ConnectionState {
  return {
    isConnected: mongoConnection?.readyState === 1,
    readyState: mongoConnection?.readyState ?? 0,
    error: lastError,
  };
}

// Fonction pour obtenir la connexion actuelle
export function getCurrentConnection(): Connection | null {
  return mongoConnection;
}

// Ajouter cette fonction pour la fermeture propre de Memory Server
export async function closeMemoryServer() {
  if (process.env.NODE_ENV === "test" && process.env.USE_MEMORY_DB === "true") {
    const mongod = await MongoMemoryServer.create();
    await mongod.stop();
  }
}
