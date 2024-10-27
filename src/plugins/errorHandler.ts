import { FastifyError, FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { AppError } from '../errors';

export const errorHandler: FastifyPluginAsync = fp(async (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error: FastifyError | AppError, request, reply) => {
    fastify.log.error(error);

    // Erreurs personnalisées
    if (error instanceof AppError) {
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
});

export default errorHandler;