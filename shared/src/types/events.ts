// shared/src/types/events.ts
export enum EventTypes {
  // Événements utilisateur
  USER_CREATED = "user.created",
  USER_UPDATED = "user.updated",
  USER_DELETED = "user.deleted",
  USER_LOGIN = "user.login",

  // Événements citations
  QUOTE_CREATED = "quote.created",
  QUOTE_UPDATED = "quote.updated",
  QUOTE_DELETED = "quote.deleted",
  QUOTE_VIEWED = "quote.viewed",
  QUOTE_FAVORITED = "quote.favorited",
  QUOTE_UNFAVORITED = "quote.unfavorited",

  // Événements profil
  PROFILE_UPDATED = "profile.updated",
  PREFERENCES_UPDATED = "preferences.updated",

  // Événements notifications
  NOTIFICATION_SENT = "notification.sent",
  DAILY_QUOTE_REQUESTED = "daily.quote.requested",
  WEEKLY_DIGEST_REQUESTED = "weekly.digest.requested",

  // Événements système
  ERROR_OCCURRED = "system.error",
  SERVICE_STATUS = "system.status",
}

export interface UserEventData {
  userId: string;
  email: string;
  role: string;
  timestamp: number;
}
