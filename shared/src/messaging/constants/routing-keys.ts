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
