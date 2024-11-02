import { UserProfile, Quote, UserEventData } from "@quote-generator/shared";
import {
  IUserRepository,
  UserPreferences,
  ReadingHistory,
} from "../domain/repositories/IUserRepository";

export class UserService {
  private apiUrl = "http://localhost:3000";

  constructor(private readonly userRepository?: IUserRepository) {}

  // Méthodes pour le frontend
  async getProfile(userId: string): Promise<UserProfile> {
    const response = await fetch(`${this.apiUrl}/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch profile");
    return response.json();
  }

  async getFavorites(userId: string): Promise<Quote[]> {
    const response = await fetch(`${this.apiUrl}/users/${userId}/favorites`);
    if (!response.ok) throw new Error("Failed to fetch favorites");
    return response.json();
  }

  async updateProfile(
    userId: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> {
    const response = await fetch(`${this.apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to update profile");
    return response.json();
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<UserProfile["profile"]["preferences"]>
  ): Promise<UserProfile> {
    const response = await fetch(`${this.apiUrl}/users/${userId}/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferences),
    });
    if (!response.ok) throw new Error("Failed to update preferences");
    return response.json();
  }

  // Méthodes pour le backend event handling
  async handleUserCreated(userData: UserEventData): Promise<void> {
    if (!this.userRepository) {
      throw new Error("UserRepository not initialized");
    }

    console.log("Creating user profile for:", userData);

    await this.userRepository.create({
      id: userData.userId,
      email: userData.email,
      role: userData.role,
      profile: {
        preferences: {
          theme: "light",
          notifications: {
            dailyQuote: true,
            weeklyDigest: true,
          },
          preferredTags: [],
          favoriteAuthors: [],
        },
        stats: {
          quotesViewed: 0,
          favoriteCount: 0,
          createdAt: new Date(userData.timestamp),
        },
      },
      favoriteQuotes: [],
    });
  }

  async handleUserUpdated(userData: UserEventData): Promise<void> {
    if (!this.userRepository) {
      throw new Error("UserRepository not initialized");
    }

    console.log("Updating user profile for:", userData);

    await this.userRepository.update(userData.userId, {
      email: userData.email,
      role: userData.role,
    });
  }

  async handleQuoteFavorited(userId: string, quoteId: string): Promise<void> {
    if (!this.userRepository) {
      throw new Error("UserRepository not initialized");
    }

    console.log(`User ${userId} favorited quote ${quoteId}`);

    await this.userRepository.addFavoriteQuote(userId, quoteId);
    await this.userRepository.incrementStat(userId, "favoriteCount");
  }

  async removeQuoteFromFavorites(
    userId: string,
    quoteId: string
  ): Promise<void> {
    if (!this.userRepository) {
      throw new Error("UserRepository not initialized");
    }

    await this.userRepository.removeFavoriteQuote(userId, quoteId);
    await this.userRepository.incrementStat(userId, "favoriteCount");
  }

  async incrementQuoteViewed(userId: string): Promise<void> {
    if (!this.userRepository) {
      throw new Error("UserRepository not initialized");
    }

    await this.userRepository.incrementStat(userId, "quotesViewed");
  }

  async getReadingHistory(userId: string): Promise<ReadingHistory[]> {
    if (!this.userRepository) {
      throw new Error("UserRepository not initialized");
    }

    return this.userRepository.getReadingHistory(userId);
  }

  async getPreferencesFromDB(userId: string): Promise<UserPreferences> {
    if (!this.userRepository) {
      throw new Error("UserRepository not initialized");
    }

    return this.userRepository.getPreferences(userId);
  }

  // Méthodes utilitaires
  private async makeApiRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  private buildUrl(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }

  private handleError(error: unknown): never {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unknown error occurred");
  }
}
