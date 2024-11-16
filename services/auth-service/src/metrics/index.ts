import promClient from "prom-client";

export const register = new promClient.Registry();

promClient.collectDefaultMetrics({
  register,
  prefix: "auth_service_",
});

export const authMetrics = {
  loginAttempts: new promClient.Counter({
    name: "auth_login_attempts_total",
    help: "Total number of login attempts",
    labelNames: ["status"],
    registers: [register],
  }),
  activeUsers: new promClient.Gauge({
    name: "auth_active_users",
    help: "Current number of active users",
    registers: [register],
  }),
  authDuration: new promClient.Histogram({
    name: "auth_request_duration_seconds",
    help: "Duration of authentication requests",
    labelNames: ["method", "path", "status"],
    buckets: [0.1, 0.5, 1, 2, 5],
    registers: [register],
  }),
};
