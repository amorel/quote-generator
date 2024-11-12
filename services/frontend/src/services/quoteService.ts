import { QuoteDTO } from "@quote-generator/shared";
import { httpService } from "./httpService";
import { authService } from "./authService";

export const quoteService = {
  async getRandomQuote(): Promise<QuoteDTO> {
    try {
      const quotes = await httpService.get<QuoteDTO[]>("/quotes/random");
      return Array.isArray(quotes) ? quotes[0] : quotes;
    } catch (error) {
      console.error("Error fetching quote:", error);
      throw error;
    }
  },

  async toggleFavorite(quoteId: string, isFavorite: boolean): Promise<void> {
    if (!authService.isTokenValid()) {
      authService.logout();
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    const endpoint = `/quotes/${quoteId}/favorite`;
    try {
      console.log("🔄 Tentative de toggle favorite:", {
        quoteId,
        isFavorite,
        endpoint,
      });

      if (isFavorite) {
        await httpService.post(endpoint);
      } else {
        await httpService.delete(endpoint);
      }

      console.log("✅ Toggle favorite réussi");
    } catch (error) {
      console.error("❌ Erreur toggle favorite:", {
        error,
        quoteId,
        isFavorite,
        endpoint,
      });
      throw error;
    }
  },

  async getFavorites(): Promise<string[]> {
    try {
      const response = await httpService.get<string[]>("/quotes/favorites");
      return response;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw error;
    }
  },
};
