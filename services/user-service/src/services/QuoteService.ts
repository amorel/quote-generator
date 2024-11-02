import { Quote } from "@quote-generator/shared";

interface QuoteQuery {
  tags?: string[];
  authors?: string[];
  excludeIds?: string[];
  limit?: number;
}

export class QuoteService {
  async getQuotes(query: QuoteQuery): Promise<Quote[]> {
    // Implémentation
    return [];
  }
}
