import promClient from "prom-client";

const PREFIX = "quotes_";

// Initialiser le registre
export const register = new promClient.Registry();

// Activer la collecte des métriques par défaut avec un préfixe spécifique au service
promClient.collectDefaultMetrics({
  register,
  prefix: PREFIX,
});

// Définir les métriques spécifiques aux citations
export const quoteMetrics = {
  favoritesTotal: new promClient.Counter({
    name: `${PREFIX}favorites_total`,
    help: "Total number of quotes marked as favorite",
    labelNames: ["quote_id", "user_id"],
    registers: [register],
  }),
  viewsTotal: new promClient.Counter({
    name: `${PREFIX}views_total`,
    help: "Total number of quote views",
    labelNames: ["quote_id"],
    registers: [register],
  }),
  randomGenerations: new promClient.Counter({
    name: `${PREFIX}random_generations_total`,
    help: "Total number of random quote generations",
    registers: [register],
  }),
  requestDuration: new promClient.Histogram({
    name: `${PREFIX}request_duration_seconds`,
    help: "Duration of quote-related requests in seconds",
    labelNames: ["method", "path", "status"],
    buckets: [0.1, 0.5, 1, 2, 5],
    registers: [register],
  }),
  activeQuotes: new promClient.Gauge({
    name: `${PREFIX}active_quotes_total`,
    help: "Total number of active quotes in the system",
    registers: [register],
  }),
};
