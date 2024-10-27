import { FastifyError, FastifyInstance, FastifyPluginAsync } from 'fastify';
import { AppError } from '../errors';

export const errorHandler: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error: FastifyError | AppError, request, reply) => {
    fastify.log.error(error);

    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        status: 'error',
        message: error.message,
        code: error.statusCode
      });
    }

    // Erreurs de validation Fastify
    if (error.validation) {
      return reply.status(400).send({
        status: 'error',
        message: 'Erreur de validation',
        details: error.validation,
        code: 400
      });
    }

    // Erreur par défaut
    return reply.status(500).send({
      status: 'error',
      message: 'Une erreur interne est survenue',
      code: 500
    });
  });
};