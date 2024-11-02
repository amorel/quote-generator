import Fastify, {
  FastifyReply,
  FastifyInstance,
  FastifyError,
  FastifyRequest,
} from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { Container } from "./container";
import { NotFoundError } from "./interface/errors";
import { QuoteFilters } from "./domain/value-objects/QuoteFilters";
import { TagController } from "./interface/api/controllers/TagController";
import { AuthorController } from "./interface/api/controllers/AuthorController";
import { QuoteController } from "./interface/api/controllers/QuoteController";
import { authMiddleware } from "./middleware/authMiddleware";
import { JWTService } from "./services/JWTService";
import { AuthService } from "./services/AuthService";
import { Quote } from "@quote-generator/shared";

// Interfaces pour le typage des requêtes
interface QuoteQueryRequest {
  Querystring: {
    limit?: number;
    maxLength?: number;
    minLength?: number;
    tags?: string;
    author?: string;
  };
}

interface QuoteParamsRequest {
  Params: {
    id: string;
  };
}

interface TagParamsRequest {
  Params: {
    id: string;
  };
}

interface AuthorParamsRequest {
  Params: {
    id: string;
  };
}

export async function build(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true,
  });
  const authService = new AuthService();
  const container = Container.getInstance();
  const jwtService = container.get<JWTService>("jwtService");

  const publicRoutes: string[] = [
    "/health",
    "/auth/login",
    "/auth/register",
    "/auth/validate",
    "/documentation",
    "/documentation/json",
    "/documentation/yaml",
    "/documentation/static",
  ];

  // hook global
  // app.addHook("preHandler", authMiddleware);
  // Middleware d'authentification
  app.addHook(
    "preHandler",
    async (request: FastifyRequest, reply: FastifyReply) => {
      if (publicRoutes.some((route) => request.url.startsWith(route))) {
        return;
      }

      const token = request.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        throw new Error("No token provided");
      }

      try {
        const userData = await authService.validateToken(token);
        request.user = userData;
      } catch (error) {
        reply.status(401).send({ error: "Unauthorized" });
      }
    }
  );

  // Configuration des gestionnaires d'erreur
  app.setErrorHandler((error: FastifyError, request, reply) => {
    console.error("Detailed error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
      validation: error.validation,
    });

    // Erreurs personnalisées
    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        status: "error",
        message: error.message,
      });
    }

    // Erreurs de validation Fastify
    if (error.validation) {
      return reply.status(400).send({
        status: "error",
        message: "Erreur de validation",
        details: error.validation,
      });
    }

    // Erreur par défaut
    return reply.status(500).send({
      status: "error",
      message: "Une erreur interne est survenue",
    });
  });

  // Plugins
  await app.register(cors);
  await app.register(swagger, {
    swagger: {
      info: {
        title: "Quote Generator API",
        description: "API pour générer des citations aléatoires",
        version: "1.0.0",
      },
      securityDefinitions: {
        bearerAuth: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      tags: [
        {
          name: "quotes",
          description: "Endpoints pour la gestion des citations",
        },
        { name: "tags", description: "Endpoints pour la gestion des tags" },
        {
          name: "authors",
          description: "Endpoints pour la gestion des auteurs",
        },
        { name: "system", description: "Endpoints système" },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: "/documentation",
  });

  // Routes
  app.get(
    "/health",
    {
      schema: {
        tags: ["system"],
        description: "Vérifier l'état du système",
        response: {
          200: {
            type: "object",
            properties: {
              status: { type: "string" },
            },
          },
        },
      },
    },
    async () => ({ status: "ok" })
  );

  app.post("/auth/validate", async (request, reply) => {
    const token = request.headers.authorization?.replace("Bearer ", "");
    try {
      if (!token) {
        throw new Error("No token provided");
      }
      const decoded = jwtService.verifyToken(token);
      return reply.send({ valid: true, user: decoded });
    } catch (error) {
      return reply.status(401).send({ valid: false });
    }
  });

  app.get<QuoteQueryRequest>(
    "/quotes/random",
    {
      // preHandler: authMiddleware, // authentication required
      schema: {
        tags: ["quotes"],
        description: "Obtenir des citations aléatoires avec filtres",
        querystring: {
          type: "object",
          properties: {
            limit: { type: "integer", minimum: 1, maximum: 50, default: 1 },
            maxLength: { type: "integer", minimum: 1 },
            minLength: { type: "integer", minimum: 1 },
            tags: { type: "string" },
            author: { type: "string" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: { type: "string" },
                content: { type: "string" },
                author: { type: "string" },
                tags: { type: "array", items: { type: "string" } },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const quoteController = container.get<QuoteController>("quoteController");
      return quoteController.getRandomQuotes(request, reply);
    }
  );

  app.get<QuoteParamsRequest>(
    "/quotes/:id",
    {
      schema: {
        tags: ["quotes"],
        description: "Obtenir une citation par son ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              _id: { type: "string" },
              content: { type: "string" },
              author: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const quoteController = container.get<QuoteController>("quoteController");
      return quoteController.getQuoteById(request, reply);
    }
  );

  app.get(
    "/tags",
    {
      schema: {
        tags: ["tags"],
        description: "Obtenir la liste de tous les tags",
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const tagController = container.get<TagController>("tagController");
      return tagController.getAllTags(request, reply);
    }
  );

  app.get<TagParamsRequest>(
    "/tags/:id",
    {
      schema: {
        tags: ["tags"],
        description: "Obtenir un tag par son ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              _id: { type: "string" },
              name: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const tagController = container.get<TagController>("tagController");
      return tagController.getTagById(request, reply);
    }
  );

  app.get(
    "/authors",
    {
      schema: {
        tags: ["authors"],
        description: "Obtenir la liste de tous les auteurs",
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                _id: { type: "string" },
                name: { type: "string" },
                link: { type: "string" },
                bio: { type: "string" },
                description: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const authorController =
        container.get<AuthorController>("authorController");
      return authorController.getAllAuthors(request, reply);
    }
  );

  app.get<AuthorParamsRequest>(
    "/authors/:id",
    {
      schema: {
        tags: ["authors"],
        description: "Obtenir un auteur par son ID",
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              _id: { type: "string" },
              name: { type: "string" },
              link: { type: "string" },
              bio: { type: "string" },
              description: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const authorController =
        container.get<AuthorController>("authorController");
      return authorController.getAuthorById(request, reply);
    }
  );

  // Route de debug qui montre l'état actuel du système
  app.get(
    "/debug",
    {
      schema: {
        tags: ["system"],
        description: "Obtenir des informations de debug sur le système",
        response: {
          200: {
            type: "object",
            properties: {
              quote: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    content: { type: "string" },
                    authorName: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                  },
                },
              },
              tagsCount: { type: "number" },
              authorsCount: { type: "number" },
              exampleTag: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                },
              },
              exampleAuthor: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  link: { type: "string" },
                  bio: { type: "string" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        console.log("Debug route called");
        const container = Container.getInstance();

        // Récupération des contrôleurs
        const quoteController =
          container.get<QuoteController>("quoteController");
        const tagController = container.get<TagController>("tagController");
        const authorController =
          container.get<AuthorController>("authorController");

        console.log("Controllers retrieved");

        // Récupération d'une citation aléatoire
        const randomQuoteRequest = {
          query: { limit: 1 },
          log: request.log,
        } as FastifyRequest<{ Querystring: { limit: number } }>;

        console.log("Getting random quote...");
        const quote = await quoteController.getRandomQuotes(
          randomQuoteRequest,
          reply
        );
        console.log("Random quote retrieved:", quote);

        // Récupération des tags
        console.log("Getting tags...");
        const tags = await tagController.getAllTags(request, reply);
        console.log("Tags retrieved:", tags?.length);

        // Récupération des auteurs
        console.log("Getting authors...");
        const authors = await authorController.getAllAuthors(request, reply);
        console.log("Authors retrieved:", authors?.length);

        const debugResponse = {
          quote,
          tagsCount: tags?.length || 0,
          authorsCount: authors?.length || 0,
          exampleTag: tags?.[0] || null,
          exampleAuthor: authors?.[0] || null,
        };

        console.log("Sending debug response:", debugResponse);

        // Vérifier si la réponse n'a pas déjà été envoyée
        if (!reply.sent) {
          return reply.status(200).send(debugResponse);
        }
      } catch (error) {
        console.error("Debug route error:", error);
        // Vérifier si la réponse n'a pas déjà été envoyée
        if (!reply.sent) {
          return reply.status(500).send({
            status: "error",
            message:
              "Une erreur est survenue lors de la récupération des données de debug",
            details: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }
    }
  );

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

  return app;
}
