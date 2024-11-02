import { build } from "./app";
import { config } from "dotenv";
import { RabbitMQClient } from "./infrastructure/messaging/RabbitMQClient";
import { UserService } from "./services/UserService";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import { connectDB } from "./config/database";

// Charger les variables d'environnement
config();

const start = async () => {
  try {
    // Créer les dépendances
    const userRepository = new UserRepository();
    const userService = new UserService(userRepository);

    // Connexion à MongoDB
    await connectDB();

    // Connexion à RabbitMQ
    const messageBroker = new RabbitMQClient(
      process.env.MESSAGE_BROKER_URL || "amqp://localhost",
      userService
    );

    // Initialisation des connexions
    await messageBroker.connect();
    await messageBroker.subscribe();

    // Démarrage du serveur...
    const app = await build();
    await app.listen({ port: 3003 });

    // Gestionnaire de fermeture propre
    process.on("SIGTERM", async () => {
      console.log("SIGTERM signal received");
      await messageBroker.close();
      process.exit(0);
    });

    // Gestionnaire pour SIGINT (Ctrl+C)
    process.on("SIGINT", async () => {
      console.log("SIGINT signal received");
      await messageBroker.close();
      process.exit(0);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

start();
