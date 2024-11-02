import mongoose, { Document, Schema } from "mongoose";
import { UserProfile } from "@quote-generator/shared";

export interface IUserDocument extends Document {
  _id: string;
  email: string;
  role: string;
  profile: {
    name?: string;
    avatar?: string;
    bio?: string;
    preferences: {
      theme: "light" | "dark";
      notifications: {
        dailyQuote: boolean;
        weeklyDigest: boolean;
      };
      preferredTags: string[];
      favoriteAuthors: string[];
    };
    stats: {
      quotesViewed: number;
      favoriteCount: number;
      createdAt: Date;
    };
  };
  favoriteQuotes: string[];
  readingHistory: Array<{
    quoteId: string;
    timestamp: Date;
  }>;
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  profile: {
    name: String,
    avatar: String,
    bio: String,
    preferences: {
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      notifications: {
        dailyQuote: { type: Boolean, default: true },
        weeklyDigest: { type: Boolean, default: true }
      },
      preferredTags: [String],
      favoriteAuthors: [String]
    },
    stats: {
      quotesViewed: { type: Number, default: 0 },
      favoriteCount: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
    }
  },
  favoriteQuotes: [String],
  readingHistory: [{
    quoteId: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

export const UserModel = mongoose.model<IUserDocument>("User", userSchema);