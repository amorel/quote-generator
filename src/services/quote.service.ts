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
    try {
      this.validateFilters(filters);
      const quotes = await this.repository.findRandom(filters);

      if (quotes.length === 0) {
        throw new NotFoundError("Aucune citation ne correspond aux critères");
      }

      const shuffled = this.shuffle(quotes);
      const limit = filters.limit || 1;
      return shuffled.slice(0, limit);
    } catch (error) {
      // Si c'est une de nos erreurs personnalisées, on la propage
      if (error instanceof NotFoundError || error instanceof ValidationError) {
        throw error;
      }

      // Pour toute autre erreur, on la transforme en ServiceError
      throw new ServiceError("Erreur lors de la récupération des citations");
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
