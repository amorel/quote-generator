import Fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { QuoteService } from "./services/quote.service";
import { QuoteFilters } from "./types/quote";

const app = Fastify({
  logger: true,
});

// Service des citations
const quoteService = new QuoteService();

const buildApp = async () => {
  const app = Fastify({
    logger: true,
  });
  // Configuration Swagger - IMPORTANT: enregistrer avant les routes
  await app.register(swagger, {
    swagger: {
      info: {
        title: "Quote Generator API",
        description: "API pour générer des citations aléatoires",
        version: "1.0.0",
      },
      host: "localhost:3000",
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  // Interface Swagger UI - IMPORTANT: enregistrer après swagger mais avant les routes
  await app.register(swaggerUi, {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: true,
  });

  // Enregistrer CORS
  await app.register(cors);

  // Définition des schémas
  const Quote = {
    type: "object",
    properties: {
      _id: { type: "string" },
      content: { type: "string" },
      author: { type: "string" },
      tags: {
        type: "array",
        items: { type: "string" },
      },
    },
  } as const;

  const QuotesResponse = {
    type: "array",
    items: Quote,
  } as const;

  // Route de test
  app.get(
    "/health",
    {
      schema: {
        tags: ["system"],
        description: "Vérifier l'état du serveur",
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
    async () => {
      return { status: "ok" };
    }
  );

  // Route pour les citations aléatoires
  app.get(
    "/quotes/random",
    {
      schema: {
        tags: ["quotes"],
        description: "Obtenir une ou plusieurs citations aléatoires",
        querystring: {
          type: "object",
          properties: {
            limit: {
              type: "integer",
              description: "Nombre de citations à retourner",
              default: 1,
              minimum: 1,
              maximum: 50,
            },
            maxLength: {
              type: "integer",
              description: "Longueur maximale de la citation",
            },
            minLength: {
              type: "integer",
              description: "Longueur minimale de la citation",
            },
            tags: {
              type: "string",
              description: "Tags à filtrer (séparés par des virgules)",
            },
            author: {
              type: "string",
              description: "Filtrer par auteur",
            },
          },
        },
        response: {
          200: QuotesResponse,
        },
      },
    },
    async (request) => {
      const filters = request.query as QuoteFilters;
      return quoteService.getRandomQuotes(filters);
    }
  );
  return app;
};

const start = async () => {
  try {
    const app = await buildApp();
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server running on http://localhost:3000");
    console.log(
      "Documentation available on http://localhost:3000/documentation"
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
