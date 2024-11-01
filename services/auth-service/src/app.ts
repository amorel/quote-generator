import Fastify from "fastify";
import cors from "@fastify/cors";
import authRoutes from "./routes/auth";

export async function build() {
  const app = Fastify({ logger: true });

  // Configurer CORS pour accepter les requêtes du frontend
  await app.register(cors, {
    origin: true, // En production, spécifiez l'URL exacte du frontend
    credentials: true
  });

  // Enregistrer les routes d'authentification
  await app.register(authRoutes, { prefix: "/auth" });

  app.get("/health", async () => ({ status: "ok" }));

  app.ready(() => {
    console.log(app.printRoutes());
  });

  return app;
}
