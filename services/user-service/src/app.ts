import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { UserController } from "interface/api/controllers/UserController";
import { Container } from './container';

export async function build() {
  const app = Fastify({ logger: true });

  await app.register(cors);
  await app.register(swagger, {
    swagger: {
      info: {
        title: "User Service API",
        description: "API pour la gestion des utilisateurs",
        version: "1.0.0",
      },
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/documentation",
  });

  app.get("/health", async () => ({ status: "ok" }));

  const container = Container.getInstance();
  const userController = container.get<UserController>("userController");

  app.get("/users", async (request, reply) => {
    return userController.getAllUsers(request, reply);
  });

  return app;
}
