import Fastify from 'fastify';
import proxy from '@fastify/http-proxy';

export async function build() {
  const app = Fastify({ logger: true });

  // Route vers le service d'authentification
  app.register(proxy, {
    prefix: '/auth',
    upstream: 'http://auth-service:3001'
  });

  // Route vers le service de citations
  app.register(proxy, {
    prefix: '/quotes',
    upstream: 'http://quote-service:3002'
  });

  // Route vers le service utilisateurs
  app.register(proxy, {
    prefix: '/users',
    upstream: 'http://user-service:3003'
  });

  return app;
}