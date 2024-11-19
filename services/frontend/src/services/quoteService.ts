import { AuthError, handleError } from '../utils/errorHandler';
import { QuoteDTO } from "@quote-generator/shared";
import { httpService } from "./httpService";
import { authService } from "./authService";

export const quoteService = {
  async getRandomQuote(): Promise<QuoteDTO> {
    try {
      const quotes = await httpService.get<QuoteDTO[]>("/quotes/random");
      return Array.isArray(quotes) ? quotes[0] : quotes;
    } catch (error) {
      return handleError(error, 'QuoteService.getRandomQuote');
    }
  },

  async toggleFavorite(quoteId: string, isFavorite: boolean): Promise<void> {
    try {
      if (!authService.isTokenValid()) {
        throw new AuthError();
      }

      const endpoint = `/quotes/${quoteId}/favorite`;
      if (isFavorite) {
        await httpService.post(endpoint);
      } else {
        await httpService.delete(endpoint);
      }
      console.log("✅ Toggle favorite réussi");
    } catch (error) {
      return handleError(error, 'QuoteService.toggleFavorite');
    }
  }
};
