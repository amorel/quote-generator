import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });

// Activer CORS
app.register(cors);

// Route de test
app.get('/health', async () => {
  return { status: 'ok' };
});

// Route basique pour une citation aléatoire
app.get('/quotes/random', async () => {
  return {
    _id: "1",
    content: "In the depth of winter, I finally learned that there was within me an invincible summer.",
    author: "Albert Camus",
    tags: ["Famous Quotes", "Inspirational"]
  };
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