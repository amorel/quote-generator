import { UserEventConsumer } from "./messaging/UserEventConsumer";
import { UserService } from "./services/UserService";
import { UserRepository } from "./infrastructure/repositories/UserRepository";
import Fastify, { FastifyInstance } from "fastify";

export async function build(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });
  return app;
}

export async function startApp() {
  const app = await build();

  // Initialiser les dépendances
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  // Configurer le consumer d'événements
  const consumer = new UserEventConsumer(
    process.env.MESSAGE_BROKER_URL || "amqp://admin:password@rabbitmq:5672",
    "user-service",
    userService
  );

  try {
    // Connecter à RabbitMQ
    await consumer.connect();

    // Mettre en place les subscriptions
    await consumer.setupSubscriptions();

    console.log("🎯 Event subscriptions configured successfully");

    // Démarrer le serveur
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3003;
    await app.listen({ port, host: "0.0.0.0" });

    console.log(`🚀 Server running on port ${port}`);

    // Gestion de l'arrêt propre
    const shutdown = async () => {
      console.log("Shutting down gracefully...");
      await consumer.close();
      await app.close();
      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startApp();
}
