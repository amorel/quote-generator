import { Quote, QuoteFilters } from '../types/quote';
import { IQuoteRepository } from '../repositories/quote.repository';

export class QuoteService {
  constructor(private repository: IQuoteRepository) {}

  async getRandomQuotes(filters: QuoteFilters): Promise<Quote[]> {
    try {
      const quotes = await this.repository.findRandom(filters);
      
      // Mélanger les citations
      const shuffled = this.shuffle(quotes);
      
      // Appliquer la limite
      const limit = filters.limit || 1;
      return shuffled.slice(0, limit);
    } catch (error) {
      throw new Error('Erreur lors de la récupération des citations');
    }
  }

  async getQuoteById(id: string): Promise<Quote> {
    const quote = await this.repository.findById(id);
    if (!quote) {
      throw new Error('Citation non trouvée');
    }
    return quote;
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