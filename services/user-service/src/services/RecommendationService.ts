import { Quote } from "@quote-generator/shared";
import { IUserRepository } from "../domain/repositories/IUserRepository";
import { QuoteService } from "./QuoteService";
import { ReadingHistory } from "../domain/repositories/IUserRepository";

export class RecommendationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly quoteService: QuoteService
  ) {}

  private analyzeFavoriteCategories(history: ReadingHistory[]): string[] {
    return [];
  }

  private analyzePreferredAuthors(history: ReadingHistory[]): string[] {
    return [];
  }

  async getPersonalizedRecommendations(userId: string): Promise<Quote[]> {
    const history = await this.userRepository.getReadingHistory(userId);
    const preferences = await this.userRepository.getPreferences(userId);

    const favoriteCategories = this.analyzeFavoriteCategories(history);
    const preferredAuthors = this.analyzePreferredAuthors(history);

    const recommendationQuery = {
      tags: [...favoriteCategories, ...preferences.preferredTags],
      authors: [...preferredAuthors, ...preferences.favoriteAuthors],
      excludeIds: history.map((h) => h.quoteId),
      limit: 5,
    };

    return this.quoteService.getQuotes(recommendationQuery);
  }
}
