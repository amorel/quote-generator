import Fastify, {
  FastifyInstance,
  FastifyError,
  FastifyRequest,
} from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { Container } from "./container";
import { QuoteService } from "./services/quote.service";
import { NotFoundError } from "./errors";
import { QuoteFilters } from "./types/quote";
import { AuthorService } from "./services/author.service";
import { TagService } from "./services/tag.service";

// Interfaces pour le typage des requêtes
interface QuoteQueryRequest {
  Querystring: QuoteFilters;
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

  const container = Container.getInstance();
  const quoteService = container.get<QuoteService>("quoteService");

  // Configuration des gestionnaires d'erreur
  app.setErrorHandler((error: FastifyError, request, reply) => {
    app.log.error(error);

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

  app.get<QuoteQueryRequest>(
    "/quotes/random",
    {
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
    async (request) => quoteService.getRandomQuotes(request.query)
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
      const { id } = request.params;
      return quoteService.getQuoteById(id);
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
    async () => {
      const tagService = container.get<TagService>("tagService");
      return tagService.getAllTags();
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
    async (request) => {
      const tagService = container.get<TagService>("tagService");
      return tagService.getTagById(request.params.id);
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
    async () => {
      const authorService = container.get<AuthorService>("authorService");
      return authorService.getAllAuthors();
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
    async (request) => {
      const authorService = container.get<AuthorService>("authorService");
      return authorService.getAuthorById(request.params.id);
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
                type: "object",
                properties: {
                  _id: { type: "string" },
                  content: { type: "string" },
                  author: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                },
              },
              tagsCount: { type: "number" },
              authorsCount: { type: "number" },
              exampleTag: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                },
              },
              exampleAuthor: {
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
    },
    async () => {
      const container = Container.getInstance();
      const quoteService = container.get<QuoteService>("quoteService");
      const tagService = container.get<TagService>("tagService");
      const authorService = container.get<AuthorService>("authorService");

      const randomQuote = await quoteService.getRandomQuotes({ limit: 1 });
      const allTags = await tagService.getAllTags();
      const allAuthors = await authorService.getAllAuthors();

      return {
        quote: randomQuote[0],
        tagsCount: allTags.length,
        authorsCount: allAuthors.length,
        exampleTag: allTags[0],
        exampleAuthor: allAuthors[0],
      };
    }
  );

  return app;
}
