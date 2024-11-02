import { UserProfile } from "@quote-generator/shared";

export interface ReadingHistory {
  quoteId: string;
  timestamp: Date;
}

export interface UserPreferences {
  theme: "light" | "dark";
  notifications: {
    dailyQuote: boolean;
    weeklyDigest: boolean;
  };
  preferredTags: string[];
  favoriteAuthors: string[];
  email: string;
}

export interface IUserRepository {
  create(userData: Partial<UserProfile>): Promise<UserProfile>;
  findById(id: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  update(id: string, data: Partial<UserProfile>): Promise<UserProfile | null>;
  addFavoriteQuote(userId: string, quoteId: string): Promise<void>;
  removeFavoriteQuote(userId: string, quoteId: string): Promise<void>;
  incrementStat(userId: string, stat: string): Promise<void>;
  getReadingHistory(userId: string): Promise<ReadingHistory[]>;
  getPreferences(userId: string): Promise<UserPreferences>;
}
