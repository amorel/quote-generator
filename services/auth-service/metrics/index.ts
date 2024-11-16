import promClient from "prom-client";

// Initialiser le registre
export const register = new promClient.Registry();

// Activer la collecte des métriques par défaut avec un préfixe spécifique au service
promClient.collectDefaultMetrics({ 
  register,
  prefix: 'auth_service_'
});

// Définir les métriques spécifiques aux citations
export const quoteMetrics = {
  // Compteur pour les citations favorites
  favoritesTotal: new promClient.Counter({
    name: "quotes_favorites_total",
    help: "Total number of quotes marked as favorite",
    labelNames: ["quote_id", "user_id"],
    registers: [register],
  }),

  // Compteur pour les vues de citations
  viewsTotal: new promClient.Counter({
    name: "quotes_views_total",
    help: "Total number of quote views",
    labelNames: ["quote_id"],
    registers: [register],
  }),

  // Compteur pour les générations aléatoires
  randomGenerations: new promClient.Counter({
    name: "quotes_random_generations_total",
    help: "Total number of random quote generations",
    registers: [register],
  }),

  // Histogramme pour le temps de réponse
  requestDuration: new promClient.Histogram({
    name: "quote_request_duration_seconds",
    help: "Duration of quote-related requests in seconds",
    labelNames: ["method", "path", "status"],
    buckets: [0.1, 0.5, 1, 2, 5],
    registers: [register],
  }),

  // Gauge pour les citations actives
  activeQuotes: new promClient.Gauge({
    name: "quotes_active_total",
    help: "Total number of active quotes in the system",
    registers: [register],
  }),
};
