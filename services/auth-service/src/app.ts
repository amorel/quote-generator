/// <reference path="./types/fastify.d.ts" />
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import authRoutes from "./routes/auth";

export async function build() {
  const app = Fastify({ logger: true });

  // Enregistrer les routes d'authentification
  await app.register(authRoutes, { prefix: "/auth" });

  app.get("/health", async () => ({ status: "ok" }));

  app.get("/debug/auth-info", {
    handler: async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        headers: request.headers,
        user: request.user || null,
        authServiceUrl: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
        environment: process.env.NODE_ENV,
        serverTime: new Date().toISOString(),
      };
    },
  });

  app.ready(() => {
    console.log(app.printRoutes());
  });

  return app;
}
