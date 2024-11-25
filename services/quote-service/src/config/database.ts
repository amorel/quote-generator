import mongoose, { Connection, ConnectOptions } from "mongoose";

// Configuration par défaut pour les différents environnements
const config = {
  development: {
    username: "admin",
    password: "password",
    host: "localhost",
    port: "27017",
    database: "quotes",
    options: "?authSource=admin",
  },
  production: {
    username: "admin",
    password: "password",
    host: "quote-db",
    port: "27017",
    database: "quotes",
    options: "?authSource=admin",
  },
  test: {
    username: "admin",
    password: "password",
    host: "localhost",
    port: "27017",
    database: "quotes_test",
    options: "?authSource=admin",
  },
};

type EnvironmentKey = keyof typeof config;

let mongoConnection: Connection | null = null;
let lastError: Error | null = null;

export async function connectDB() {
  try {
    console.log("Connecting to database...");

    // Récupère l'environnement courant
    const env = (process.env.NODE_ENV || "development") as EnvironmentKey;
    console.log(`[INFO] Environnement détecté : ${env}`);

    // Récupère la configuration correspondante à l'environnement
    const envConfig = config[env];
    if (!envConfig) {
      console.error(
        `[ERROR] La configuration pour l'environnement '${env}' est introuvable.`
      );
      process.exit(1); // Arrêt si aucune configuration n'est disponible
    } else {
      console.log(
        `[INFO] Configuration pour l'environnement '${env}' chargée avec succès.`
      );
    }

    // Récupère les variables d'environnement ou utilise les valeurs par défaut
    const username =
      process.env.MONGO_INITDB_ROOT_USERNAME || envConfig.username;
    if (process.env.MONGO_INITDB_ROOT_USERNAME) {
      console.log(
        `[INFO] Variable d'environnement 'MONGO_INITDB_ROOT_USERNAME' utilisée : ${username}`
      );
    } else {
      console.log(
        `[INFO] Valeur par défaut 'username' depuis 'envConfig' utilisée : ${username}`
      );
    }

    const password =
      process.env.MONGO_INITDB_ROOT_PASSWORD || envConfig.password;
    if (process.env.MONGO_INITDB_ROOT_PASSWORD) {
      console.log(
        `[INFO] Variable d'environnement 'MONGO_INITDB_ROOT_PASSWORD' utilisée : ${password}`
      );
    } else {
      console.log(
        `[INFO] Valeur par défaut 'password' depuis 'envConfig' utilisée : ${password}`
      );
    }

    const host = process.env.MONGO_HOST_QUOTE || envConfig.host;
    if (process.env.MONGO_HOST_QUOTE) {
      console.log(
        `[INFO] Variable d'environnement 'MONGO_HOST_QUOTE' utilisée : ${host}`
      );
    } else {
      console.log(
        `[INFO] Valeur par défaut 'host' depuis 'envConfig' utilisée : ${host}`
      );
    }

    const port = process.env.MONGO_PORT || envConfig.port;
    if (process.env.MONGO_PORT) {
      console.log(
        `[INFO] Variable d'environnement 'MONGO_PORT' utilisée : ${port}`
      );
    } else {
      console.log(
        `[INFO] Valeur par défaut 'port' depuis 'envConfig' utilisée : ${port}`
      );
    }

    const database = process.env.MONGO_DATABASE_QUOTE || envConfig.database;
    if (process.env.MONGO_DATABASE_QUOTE) {
      console.log(
        `[INFO] Variable d'environnement 'MONGO_DATABASE_QUOTE' utilisée : ${database}`
      );
    } else {
      console.log(
        `[INFO] Valeur par défaut 'database' depuis 'envConfig' utilisée : ${database}`
      );
    }

    const options = process.env.MONGO_OPTIONS || envConfig.options;
    if (process.env.MONGO_OPTIONS) {
      console.log(
        `[INFO] Variable d'environnement 'MONGO_OPTIONS' utilisée : ${options}`
      );
    } else {
      console.log(
        `[INFO] Valeur par défaut 'options' depuis 'envConfig' utilisée : ${options}`
      );
    }

    // Construit l'URI de connexion
    const uri = `mongodb://${username}:${password}@${host}:${port}/${database}${options}`;
    console.log("Connection URL:", uri);

    // Configure Mongoose
    mongoose.set("strictQuery", true);

    // Options de connexion
    const mongooseOptions: ConnectOptions = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    // console.log(uri);

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
      console.error("❌ MongoDB connection error: (On)", error);
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

    console.error("❌ MongoDB connection error: (Catch)");
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
