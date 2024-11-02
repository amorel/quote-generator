export interface UserProfile {
  id: string;
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
}
