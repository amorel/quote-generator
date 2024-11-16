/// <reference path="./types/fastify.d.ts" />
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import authRoutes from "./routes/auth";
import { AuthService } from "./services/AuthService";
import promClient from "prom-client";

// Initialiser le registre
const register = new promClient.Registry();

export async function build(authService?: AuthService) {
  const app = Fastify({ logger: true });

  // Route pour exposer les métriques
  app.get("/metrics", async (request, reply) => {
    return reply.type("text/plain").send(await register.metrics());
  });

  const service = authService || new AuthService();

  // Enregistrer les routes d'authentification
  await app.register(authRoutes, {
    prefix: "/auth",
    authService: service,
  });

  app.get("/health", async () => ({ status: "ok" }));

  app.get("/debug/auth-info", {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
