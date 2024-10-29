// src/infrastructure/repositories/QuoteRepository.ts
import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/repositories/IQuoteRepository";
import { quotes } from "../persistence/in-memory/quotes";
import { QuoteFiltersVO } from "../../domain/value-objects/QuoteFilters";
import QuoteContent from "../../domain/value-objects/QuoteContent";

export class QuoteRepository implements IQuoteRepository {
  async findRandom(filters: QuoteFiltersVO): Promise<Quote[]> {
    let filteredQuotes = [...quotes];

    // Appliquer les filtres
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

    if (filters.tags && filters.tags.length > 0) {
      const tagList = filters.tags.map((tag) => tag.toLowerCase());
      filteredQuotes = filteredQuotes.filter((quote) =>
        tagList.every((tag) =>
          quote.tags.some((quoteTag) => quoteTag.toLowerCase() === tag)
        )
      );
    }

    if (filters.author) {
      const authorName = filters.author.toLowerCase();
      filteredQuotes = filteredQuotes.filter(
        (quote) => quote.author.toLowerCase() === authorName
      );
    }

    // Appliquer la limite
    if (filters.limit && filters.limit < filteredQuotes.length) {
      const selected = [];
      const available = [...filteredQuotes];

      while (selected.length < filters.limit && available.length > 0) {
        const randomIndex = Math.floor(Math.random() * available.length);
        const quote = available.splice(randomIndex, 1)[0];
        selected.push(quote);
      }

      filteredQuotes = selected;
    }

    // Convertir en entités du domaine
    return filteredQuotes.map(
      (quote) =>
        new Quote(
          quote._id,
          QuoteContent.create(quote.content),
          quote.author,
          quote.tags
        )
    );
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = quotes.find((q) => q._id === id);

    if (!quote) {
      return null;
    }

    return new Quote(
      quote._id,
      QuoteContent.create(quote.content),
      quote.author,
      quote.tags
    );
  }
}
