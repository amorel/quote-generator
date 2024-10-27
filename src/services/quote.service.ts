import { Quote, QuoteFilters } from "../types/quote";
import { IQuoteRepository } from "../repositories/quote.repository";
import {
  NotFoundError,
  ValidationError,
  ServiceError,
  AppError,
} from "../errors";

export class QuoteService {
  constructor(private repository: IQuoteRepository) {}

  async getRandomQuotes(filters: QuoteFilters): Promise<Quote[]> {
    console.log("Fetching quotes with filters:", filters);
    try {
      this.validateFilters(filters);
      const quotes = await this.repository.findRandom(filters);
      console.log(`Found ${quotes.length} quotes matching filters`);

      if (quotes.length === 0) {
        console.log("No quotes found, throwing NotFoundError");
        throw new NotFoundError("Aucune citation ne correspond aux critères");
      }

      const shuffled = this.shuffle(quotes);
      const limit = filters.limit || 1;
      const result = shuffled.slice(0, limit);
      console.log(`Returning ${result.length} quotes`);
      return result;
    } catch (error) {
      console.error("Error in getRandomQuotes:", error);
      throw error;
    }
  }

  async getQuoteById(id: string): Promise<Quote> {
    if (!id) {
      throw new ValidationError("ID manquant");
    }

    const quote = await this.repository.findById(id);
    if (!quote) {
      throw new NotFoundError(`Citation avec l'ID ${id} non trouvée`);
    }
    return quote;
  }

  private validateFilters(filters: QuoteFilters): void {
    if (filters.limit && (filters.limit < 1 || filters.limit > 50)) {
      throw new ValidationError("La limite doit être comprise entre 1 et 50");
    }

    if (filters.minLength && filters.minLength < 0) {
      throw new ValidationError("La longueur minimale doit être positive");
    }

    if (filters.maxLength && filters.maxLength < 0) {
      throw new ValidationError("La longueur maximale doit être positive");
    }

    if (
      filters.minLength &&
      filters.maxLength &&
      filters.minLength > filters.maxLength
    ) {
      throw new ValidationError(
        "La longueur minimale ne peut pas être supérieure à la longueur maximale"
      );
    }
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
