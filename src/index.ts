import Fastify from 'fastify';
import cors from '@fastify/cors';
import { QuoteService } from './services/quote.service';
import { QuoteFilters } from './types/quote';

const app = Fastify({
  logger: true
});

// Service des citations
const quoteService = new QuoteService();

// Enregistrer CORS
app.register(cors);

// Route de test
app.get('/health', async () => {
  return { status: 'ok' };
});

// Route pour les citations aléatoires
app.get<{
  Querystring: QuoteFilters
}>('/quotes/random', async (request) => {
  const filters = request.query;
  return quoteService.getRandomQuotes(filters);
});

const start = async () => {
  try {
    await app.listen({ port: 3000 });
    console.log('Server running on port 3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();