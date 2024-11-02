import {
  IUserRepository,
  UserPreferences,
  ReadingHistory,
} from "../../domain/repositories/IUserRepository";
import { UserProfile } from "@quote-generator/shared";
import { UserModel, IUserDocument } from "../persistence/models/UserModel";
import { User } from "../../domain/entities/User";

export class UserRepository implements IUserRepository {
  async getAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(
      (user) => new User(user._id.toString(), user.email, user.role)
    );
  }

  async create(userData: Partial<UserProfile>): Promise<UserProfile> {
    const user = await UserModel.create(userData);
    return this.toUserProfile(user);
  }

  async findById(id: string): Promise<UserProfile | null> {
    const user = await UserModel.findById(id);
    return user ? this.toUserProfile(user) : null;
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const user = await UserModel.findOne({ email });
    return user ? this.toUserProfile(user) : null;
  }

  async update(
    id: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
    return user ? this.toUserProfile(user) : null;
  }

  async addFavoriteQuote(userId: string, quoteId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $addToSet: { favoriteQuotes: quoteId },
    });
  }

  async removeFavoriteQuote(userId: string, quoteId: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $pull: { favoriteQuotes: quoteId },
    });
  }

  async incrementStat(userId: string, stat: string): Promise<void> {
    await UserModel.findByIdAndUpdate(userId, {
      $inc: { [`profile.stats.${stat}`]: 1 },
    });
  }

  async getReadingHistory(userId: string): Promise<ReadingHistory[]> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user.readingHistory.map((entry) => ({
      quoteId: entry.quoteId,
      timestamp: entry.timestamp,
    }));
  }

  async getPreferences(userId: string): Promise<UserPreferences> {
    const user = await UserModel.findById(userId);
    if (!user || !user.profile?.preferences) {
      throw new Error("User preferences not found");
    }
    return {
      theme: user.profile.preferences.theme,
      notifications: user.profile.preferences.notifications,
      preferredTags: user.profile.preferences.preferredTags || [],
      favoriteAuthors: user.profile.preferences.favoriteAuthors || [],
      email: user.email,
    };
  }

  private toUserProfile(doc: IUserDocument): UserProfile {
    return {
      id: doc._id.toString(),
      email: doc.email,
      role: doc.role,
      profile: {
        name: doc.profile?.name,
        avatar: doc.profile?.avatar,
        bio: doc.profile?.bio,
        preferences: {
          theme: doc.profile?.preferences?.theme || "light",
          notifications: {
            dailyQuote:
              doc.profile?.preferences?.notifications?.dailyQuote ?? true,
            weeklyDigest:
              doc.profile?.preferences?.notifications?.weeklyDigest ?? true,
          },
          preferredTags: doc.profile?.preferences?.preferredTags || [],
          favoriteAuthors: doc.profile?.preferences?.favoriteAuthors || [],
        },
        stats: {
          quotesViewed: doc.profile?.stats?.quotesViewed ?? 0,
          favoriteCount: doc.profile?.stats?.favoriteCount ?? 0,
          createdAt: doc.profile?.stats?.createdAt ?? new Date(),
        },
      },
      favoriteQuotes: doc.favoriteQuotes || [],
    };
  }
}
