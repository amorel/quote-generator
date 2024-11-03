import { QuoteDTO } from "@quote-generator/shared";
import { httpService } from "./httpService";

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
};
