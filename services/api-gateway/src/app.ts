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

  app.register(proxy as any, {
    prefix: "/quotes",
    upstream: quoteServiceUrl,
    rewritePrefix: "/quotes",
    logLevel: "debug",
    http: {
      timeout: 5000,
    },
  });

  console.log('Quote service URL:', quoteServiceUrl);

  app.register(proxy, {
    prefix: "/users",
    upstream: userServiceUrl,
    rewritePrefix: "/users",
  });

  return app;
}
