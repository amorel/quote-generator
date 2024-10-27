import Fastify, { FastifyInstance, FastifyError } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { Container } from './container';
import { QuoteService } from './services/quote.service';
import { NotFoundError } from './errors';
import { QuoteFilters } from './types/quote';

// Interfaces pour le typage des requêtes
interface QuoteQueryRequest {
  Querystring: QuoteFilters;
}

interface QuoteParamsRequest {
  Params: {
    id: string;
  };
}

export async function build(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: true
  });

  const container = Container.getInstance();
  const quoteService = container.get<QuoteService>('quoteService');

  // Configuration des gestionnaires d'erreur
  app.setErrorHandler((error: FastifyError, request, reply) => {
    app.log.error(error);

    // Erreurs personnalisées
    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        status: 'error',
        message: error.message
      });
    }

    // Erreurs de validation Fastify
    if (error.validation) {
      return reply.status(400).send({
        status: 'error',
        message: 'Erreur de validation',
        details: error.validation
      });
    }

    // Erreur par défaut
    return reply.status(500).send({
      status: 'error',
      message: 'Une erreur interne est survenue'
    });
  });

  // Plugins
  await app.register(cors);
  await app.register(swagger, {
    swagger: {
      info: {
        title: 'Quote Generator API',
        description: 'API pour générer des citations aléatoires',
        version: '1.0.0'
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/documentation'
  });

  // Routes
  app.get('/health', {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' }
          }
        }
      }
    }
  }, async () => {
    return { status: 'ok' };
  });

  app.get<QuoteQueryRequest>('/quotes/random', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 50, default: 1 },
          maxLength: { type: 'integer', minimum: 1 },
          minLength: { type: 'integer', minimum: 1 },
          tags: { type: 'string' },
          author: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const quotes = await quoteService.getRandomQuotes(request.query);
    return quotes;
  });

  app.get<QuoteParamsRequest>('/quotes/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;
    try {
      const quote = await quoteService.getQuoteById(id);
      return quote;
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.status(404).send({
          status: 'error',
          message: error.message
        });
      }
      throw error;
    }
  });

  return app;
}