/// <reference path="../src/types/fastify.d.ts" />
import proxy from "@fastify/http-proxy";
import Fastify, {
  FastifyInstance,
  FastifyRequest,
  FastifyReply,
} from "fastify";
import cors from "@fastify/cors";
import { AuthService } from "./services/AuthService";

export async function build(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });
  const authService = new AuthService();

  await app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    "/health",
    "/auth/login",
    "/auth/register",
    "/auth/validate",
  ];

  // Hook global pour l'authentification
  app.addHook(
    "preHandler",
    async (request: FastifyRequest, reply: FastifyReply) => {
      // Logger la requête entrante
      console.log(`Incoming request: ${request.method} ${request.url}`);
      console.log("Authorization header:", request.headers.authorization);

      // Ignorer l'authentification pour les routes publiques
      if (publicRoutes.some((route) => request.url.startsWith(route))) {
        return;
      }

      const token = request.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return reply.code(401).send({ error: "Non autorisé" });
      }

      try {
        const userData = await authService.validateToken(token);
        // Enrichir la requête avec les données utilisateur pour les services en aval
        request.headers["x-user-id"] = userData.id;
        request.headers["x-user-role"] = userData.role;
        request.headers["x-user-email"] = userData.email;
        request.user = userData;
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        return reply.code(401).send({ error: "Erreur d'authentification" });
      }
    }
  );

  app.get("/health", async () => ({ status: "ok" }));

  // Configuration des services
  const authServiceUrl =
    process.env.AUTH_SERVICE_URL || "http://localhost:3001";
  const quoteServiceUrl =
    process.env.QUOTE_SERVICE_URL || "http://localhost:3002";
  const userServiceUrl =
    process.env.USER_SERVICE_URL || "http://localhost:3003";

  // Proxy vers les services
  app.register(proxy as any, {
    prefix: "/auth",
    upstream: authServiceUrl,
    rewritePrefix: "/auth",
  });

  app.addHook(
    "onRequest",
    (request: FastifyRequest, reply: FastifyReply, done) => {
      if (request.url.includes("/quotes")) {
        console.log("🚀 Gateway received request:", {
          url: request.url,
          method: request.method,
          headers: request.headers,
        });
      }
      done();
    }
  );

  app.register(proxy, {
    prefix: "/quotes",
    upstream: quoteServiceUrl,
    rewritePrefix: "/quotes",
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      // Vérifie l'authentification pour les routes liées aux favoris
      if (request.url.includes("/favorite")) {
        console.log("❗ Headers envoyés au service quote:", request.headers);
        console.log("❗ URL complète:", request.url);
        console.log("❗ Méthode:", request.method);

        const token = request.headers.authorization?.replace("Bearer ", "");
        console.log("🔑 Token extracted:", token ? "present" : "missing");

        if (!token) {
          console.log("❌ No token provided");
          reply.code(401).send({ error: "Unauthorized" });
          return;
        }

        try {
          console.log("🔄 Validating token...");
          await authService.validateToken(token);
          console.log("✅ Token validated successfully");
        } catch (error) {
          console.log("❌ Token validation failed:", error);
          reply.code(401).send({ error: "Session expired" });
          return;
        }

        console.log("✨ Authentication successful for favorite request");
      }
    },
  });

  app.addHook(
    "onResponse",
    (request: FastifyRequest, reply: FastifyReply, done) => {
      if (request.url.includes("/quotes")) {
        console.log("📨 Gateway sent response:", {
          url: request.url,
          statusCode: reply.statusCode,
          headers: reply.getHeaders(),
        });
      }
      done();
    }
  );

  console.log("Quote service URL:", quoteServiceUrl);

  app.register(proxy, {
    prefix: "/users",
    upstream: userServiceUrl,
    rewritePrefix: "/users",
  });

  return app;
}
