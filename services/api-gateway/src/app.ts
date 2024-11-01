import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function build(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: true, // Autorise toutes les origines. En production, spécifiez l'origine exacte.
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
    rewritePrefix: "/auth"
  });

  app.register(proxy as any, {
    prefix: "/quotes",
    upstream: quoteServiceUrl,
    rewritePrefix: "/quotes"
  });

  app.register(proxy as any, {
    prefix: "/users",
    upstream: userServiceUrl,
    rewritePrefix: "/users"
  });

  app.addHook("onRequest", async (request) => {
    console.log(`Incoming request: ${request.method} ${request.url}`);
  });

  return app;
}
