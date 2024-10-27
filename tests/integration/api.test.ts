import { build } from '../../src/app';
import { FastifyInstance } from 'fastify';
import { Quote } from '../../src/types/quote';

describe('API Integration Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health'
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual({ status: 'ok' });
    });
  });

  describe('GET /quotes/random', () => {
    it('should return random quote', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/quotes/random'
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload) as Quote[];
      expect(Array.isArray(payload)).toBe(true);
      expect(payload).toHaveLength(1);
    });

    it('should handle invalid limit parameter', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/quotes/random?limit=999'
      });

      expect(response.statusCode).toBe(400);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty('status', 'error');
    });

    it('should handle filters correctly', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/quotes/random?limit=2&tags=test'
      });

      expect(response.statusCode).toBe(200);
      const quotes = JSON.parse(response.payload) as Quote[];
      expect(Array.isArray(quotes)).toBe(true);
      expect(quotes.length).toBeLessThanOrEqual(2);
      quotes.forEach((quote: Quote) => {
        expect(quote.tags).toContain('test');
      });
    });
  });

  describe('GET /quotes/:id', () => {
    it('should return 404 for non-existent quote', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/quotes/nonexistent'
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty('status', 'error');
    });
  });
});