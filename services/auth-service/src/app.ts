import Fastify from "fastify";
import cors from "@fastify/cors";
import authRoutes from "./routes/auth";

export async function build() {
  const app = Fastify({ logger: true });

  await app.register(cors);

  // Enregistrer les routes d'authentification
  await app.register(authRoutes, { prefix: "/auth" });

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
