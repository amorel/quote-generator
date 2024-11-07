export const QUEUES = {
  USER_EVENTS: "user.events.queue",
  QUOTE_EVENTS: "quote.events.queue",
  NOTIFICATION_EVENTS: "notification.events.queue",
  USER_EVENTS_DLQ: "user.events.dlq",
  QUOTE_EVENTS_DLQ: "quote.events.dlq",
  NOTIFICATION_EVENTS_DLQ: "notification.events.dlq",
} as const;

export const EXCHANGES = {
  USER_EVENTS: "user.events.exchange",
  QUOTE_EVENTS: "quote.events.exchange",
  NOTIFICATION_EVENTS: "notification.events.exchange",
  DLX: "dead.letter.exchange",
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
} as const;
