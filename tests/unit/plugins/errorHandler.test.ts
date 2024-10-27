import Fastify, { FastifyInstance } from 'fastify';
import { errorHandler } from '../../../src/plugins/errorHandler';
import { NotFoundError } from '../../../src/errors';

describe('Error Handler', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    // Créer une nouvelle instance pour chaque test
    app = Fastify({ logger: false });
    await app.register(errorHandler);

    // Définir toutes les routes de test
    app.get('/test-not-found', async () => {
      throw new NotFoundError('Test not found');
    });

    app.get('/test-validation', {
      schema: {
        querystring: {
          type: 'object',
          properties: {
            num: { type: 'integer' }
          },
          required: ['num']
        }
      }
    }, async () => {
      return { ok: true };
    });

    app.get('/test-error', async () => {
      throw new Error('Unexpected error');
    });

    // Prêt pour les tests
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should handle NotFoundError', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test-not-found'
    });

    expect(response.statusCode).toBe(404);
    expect(JSON.parse(response.payload)).toEqual({
      status: 'error',
      message: 'Test not found'
    });
  });

  it('should handle validation error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test-validation'
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toEqual({
      status: 'error',
      message: 'Erreur de validation',
      details: expect.any(Array)
    });
  });

  it('should handle unexpected errors', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test-error'
    });

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.payload)).toEqual({
      status: 'error',
      message: 'Une erreur interne est survenue'
    });
  });
});