import { IUserRepository } from "../domain/repositories/IUserRepository";
import { EmailService } from "./EmailService";
import { RecommendationService } from "./RecommendationService";

export class NotificationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly recommendationService: RecommendationService,
    private readonly emailService: EmailService
  ) {}

  async sendDailyQuote(userId: string) {
    const preferences = await this.userRepository.getPreferences(userId);

    if (preferences.notifications.dailyQuote) {
      const quote =
        await this.recommendationService.getPersonalizedRecommendations(userId);
      await this.emailService.sendDailyQuote({
        to: preferences.email,
        quote: quote[0],
      });
    }
  }
}
