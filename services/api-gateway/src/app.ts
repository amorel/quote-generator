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

  app.get("/health", async () => ({ status: "ok" }));

  // Récupérer les URLs des services depuis les variables d'environnement
  const authServiceUrl =
    process.env.AUTH_SERVICE_URL || "http://localhost:3001";
  const quoteServiceUrl =
    process.env.QUOTE_SERVICE_URL || "http://localhost:3002";
  const userServiceUrl =
    process.env.USER_SERVICE_URL || "http://localhost:3003";

  // Logs pour vérifier les URLs utilisées
  console.log("Auth Service URL:", authServiceUrl);
  console.log("Quote Service URL:", quoteServiceUrl);
  console.log("User Service URL:", userServiceUrl);

  app.register(proxy as any, {
    prefix: "/auth",
    upstream: authServiceUrl,
    rewritePrefix: "/auth",
    preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
      reply.header("Access-Control-Allow-Origin", "*");
      reply.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
      );
      reply.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
    },
  });

  app.register(proxy as any, {
    prefix: "/quotes",
    upstream: quoteServiceUrl,
    rewritePrefix: "/quotes",
  });

  app.register(proxy, {
    prefix: "/users",
    upstream: userServiceUrl,
    async preHandler(request, reply) {
      try {
        // Vérifier l'authentification
        const token = request.headers.authorization;
        if (!token) {
          reply.code(401).send({ error: "Non autorisé" });
          return;
        }

        // Enrichir la requête avec les données utilisateur
        const user = await authService.validateToken(token);
        if (!user) {
          reply.code(401).send({ error: "Token invalide" });
          return;
        }
        request.user = user;
      } catch (error) {
        console.error("Erreur d'authentification:", error);
        reply.code(401).send({ error: "Erreur d'authentification" });
      }
    },
  });

  app.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log(`Incoming request: ${request.method} ${request.url}`);
    }
  );

  return app;
}
