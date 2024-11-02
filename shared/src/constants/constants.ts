export const QUEUES = {
  // Queues principales
  USER_EVENTS: "user.events.queue",
  QUOTE_EVENTS: "quote.events.queue",
  NOTIFICATION_EVENTS: "notification.events.queue",

  // Dead Letter Queues (DLQ)
  USER_EVENTS_DLQ: "user.events.dlq",
  QUOTE_EVENTS_DLQ: "quote.events.dlq",
  NOTIFICATION_EVENTS_DLQ: "notification.events.dlq",
} as const;

export const EXCHANGES = {
  USER_EVENTS: "user.events.exchange",
  QUOTE_EVENTS: "quote.events.exchange",
  NOTIFICATION_EVENTS: "notification.events.exchange",
  DLX: "dead.letter.exchange", // Exchange pour les messages morts
} as const;

export const ROUTING_KEYS = {
  USER: {
    ALL: "user.#",
    CREATED: "user.created",
    UPDATED: "user.updated",
    DELETED: "user.deleted",
    LOGIN: "user.login",
  },
  QUOTE: {
    ALL: "quote.#",
    CREATED: "quote.created",
    UPDATED: "quote.updated",
    DELETED: "quote.deleted",
    VIEWED: "quote.viewed",
    FAVORITED: "quote.favorited",
  },
  NOTIFICATION: {
    ALL: "notification.#",
    DAILY_QUOTE: "notification.daily.quote",
    WEEKLY_DIGEST: "notification.weekly.digest",
    SYSTEM: "notification.system",
  },
} as const;

export const EXCHANGE_TYPES = {
  TOPIC: "topic",
  DIRECT: "direct",
  FANOUT: "fanout",
} as const;

export const MESSAGE_TTL = {
  NORMAL: 24 * 60 * 60 * 1000, // 24 hours
  RETRY: 5 * 60 * 1000, // 5 minutes
  DLQ: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export const RABBITMQ_CONFIG = {
  RECONNECT: {
    MAX_ATTEMPTS: 5,
    INTERVAL: 5000, // 5 seconds
  },
  PREFETCH: {
    DEFAULT: 1,
    BATCH: 10,
  },
  HEARTBEAT: 60, // seconds
} as const;
