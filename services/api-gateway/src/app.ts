import Fastify from "fastify";
import proxy from "@fastify/http-proxy";
import { FastifyInstance } from "fastify";

export async function build(): Promise<FastifyInstance> {
  const app = Fastify({ logger: true });

  app.get("/health", async () => ({ status: "ok" }));

  app.register(proxy as any, {
    prefix: "/auth",
    upstream: "http://auth-service:3001",
  });

  app.register(proxy as any, {
    prefix: "/quotes",
    upstream: "http://quote-service:3002",
  });

  app.register(proxy as any, {
    prefix: "/users",
    upstream: "http://user-service:3003",
  });

  return app;
}
