export enum EventTypes {
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
  USER_LOGIN = "user.login",
  QUOTE_CREATED = "quote.created",
  QUOTE_UPDATED = "quote.updated",
  QUOTE_DELETED = "quote.deleted",
  QUOTE_VIEWED = "quote.viewed",
  QUOTE_FAVORITED = "quote.favorited",
}

export interface EventMetadata {
  timestamp: number;
  version: string;
  service: string;
  correlationId?: string;
}

export interface EventMessage<T = unknown> {
  id: string;
  type: EventTypes;
  data: T;
  metadata: EventMetadata;
}

export interface UserEventData {
  userId: string;
  email: string;
  role: string;
  timestamp: number;
}