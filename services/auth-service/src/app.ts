import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";

export async function build(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });

  await app.register(cors);

  app.get("/health", async () => ({ status: "ok" }));

  return app;
}
