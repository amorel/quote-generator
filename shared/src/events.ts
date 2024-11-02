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

// Interfaces pour les données des événements
export interface UserEventData {
  userId: string;
  email: string;
  role: string;
  timestamp: number;
}

export interface QuoteEventData {
  quoteId: string;
  userId?: string;
  content?: string;
  author?: string;
  tags?: string[];
  timestamp: number;
}

export interface ProfileEventData {
  userId: string;
  changes: {
    preferences?: UserPreferences;
    profile?: UserProfile;
  };
  timestamp: number;
}

export interface NotificationEventData {
  userId: string;
  type: "daily_quote" | "weekly_digest" | "system";
  content: unknown;
  status: "queued" | "sent" | "failed";
  timestamp: number;
}

export interface SystemEventData {
  serviceId: string;
  eventType: "error" | "status";
  severity: "info" | "warning" | "error" | "critical";
  details: unknown;
  timestamp: number;
}

// Types pour les préférences utilisateur
export interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  notificationSettings: {
    dailyQuote: boolean;
    weeklyDigest: boolean;
    email: boolean;
    push: boolean;
  };
  contentPreferences: {
    preferredTags: string[];
    preferredAuthors: string[];
    excludedTags: string[];
    quoteLanguages: string[];
  };
}

// Types pour le profil utilisateur
export interface UserProfile {
  name?: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  stats?: {
    quotesViewed: number;
    favoriteCount: number;
    lastActive: Date;
  };
}
