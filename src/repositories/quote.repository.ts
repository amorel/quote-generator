import { Quote, QuoteFilters } from "../types/quote";
import { quotes } from "../data/quotes";

export interface IQuoteRepository {
  findRandom(filters: QuoteFilters): Promise<Quote[]>;
  findById(id: string): Promise<Quote | null>;
}

export class QuoteRepository implements IQuoteRepository {
  async findRandom(filters: QuoteFilters): Promise<Quote[]> {
    let filteredQuotes = [...quotes];

    if (filters.maxLength) {
      filteredQuotes = filteredQuotes.filter(
        (quote) => quote.content.length <= filters.maxLength!
      );
    }

    if (filters.minLength) {
      filteredQuotes = filteredQuotes.filter(
        (quote) => quote.content.length >= filters.minLength!
      );
    }

    if (filters.author) {
      filteredQuotes = filteredQuotes.filter(
        (quote) => quote.author.toLowerCase() === filters.author!.toLowerCase()
      );
    }

    if (filters.tags) {
      const requestedTags = filters.tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase());
      filteredQuotes = filteredQuotes.filter((quote) =>
        // Vérifie si au moins un des tags demandés correspond à un tag de la citation
        quote.tags.some((quoteTag) =>
          requestedTags.includes(quoteTag.toLowerCase())
        )
      );

      console.log(
        `Filtered by tags: ${requestedTags}. Found ${filteredQuotes.length} quotes`
      );
    }

    return filteredQuotes;
  }

  async findById(id: string): Promise<Quote | null> {
    return quotes.find((quote) => quote._id === id) || null;
  }
}
