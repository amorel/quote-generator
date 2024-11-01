import { FastifyInstance } from "fastify";
import { LoginCredentials, RegisterCredentials } from "@quote-generator/shared";
import { AuthService } from "../services/AuthService";

export default async function (fastify: FastifyInstance) {
  const authService = new AuthService();

  // Register route
  fastify.post<{ Body: RegisterCredentials }>(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const { user, token } = await authService.register(email, password);

        return reply.code(201).send({ token, user });
      } catch (error) {
        const err = error as Error;
        return reply.code(400).send({ error: err.message });
      }
    }
  );

  // Login route
  fastify.post<{ Body: LoginCredentials }>(
    "/login",
    {
      schema: {
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const { user, token } = await authService.login(email, password);

        return reply.send({ token, user });
      } catch (error) {
        const err = error as Error;
        return reply.code(401).send({ error: err.message });
      }
    }
  );

  // Validate token route
  fastify.post(
    "/validate",
    {
      schema: {
        headers: {
          type: "object",
          properties: {
            authorization: { type: "string" },
          },
          required: ["authorization"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              valid: { type: "boolean" },
              user: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const token = request.headers.authorization?.replace("Bearer ", "");
        if (!token) {
          return reply.code(401).send({ valid: false });
        }

        const user = await authService.validateToken(token);
        return reply.send({ valid: true, user });
      } catch (error) {
        return reply.code(401).send({ valid: false });
      }
    }
  );
}
