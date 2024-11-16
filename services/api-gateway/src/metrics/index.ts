import promClient from "prom-client";

// Initialiser le registre
export const register = new promClient.Registry();

// Activer la collecte des métriques par défaut avec un préfixe
promClient.collectDefaultMetrics({
  register,
  prefix: "gateway_",
});

// Métriques spécifiques à l'API Gateway
export const gatewayMetrics = {
  // Vos compteurs existants
  httpRequestsTotal: new promClient.Counter({
    name: "gateway_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "path", "status"],
    registers: [register],
  }),

  httpRequestDuration: new promClient.Histogram({
    name: "gateway_http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "path", "status"],
    registers: [register],
  }),

  // Nouvelles métriques utiles
  proxyRequests: new promClient.Counter({
    name: "gateway_proxy_requests_total",
    help: "Total number of proxy requests by service",
    labelNames: ["service", "status"],
    registers: [register],
  }),

  authFailures: new promClient.Counter({
    name: "gateway_auth_failures_total",
    help: "Total number of authentication failures",
    labelNames: ["reason"],
    registers: [register],
  }),
};
