import { Quote, QuoteFilters } from '../types/quote';
import { quotes } from '../data/quotes';

export class QuoteService {
  getRandomQuotes(filters: QuoteFilters): Quote[] {
    let filteredQuotes = [...quotes];

    // Appliquer les filtres
    if (filters.maxLength) {
      filteredQuotes = filteredQuotes.filter(
        quote => quote.content.length <= filters.maxLength!
      );
    }

    if (filters.minLength) {
      filteredQuotes = filteredQuotes.filter(
        quote => quote.content.length >= filters.minLength!
      );
    }

    if (filters.author) {
      filteredQuotes = filteredQuotes.filter(
        quote => quote.author.toLowerCase() === filters.author!.toLowerCase()
      );
    }

    if (filters.tags) {
      const requestedTags = filters.tags.split(',');
      filteredQuotes = filteredQuotes.filter(quote =>
        requestedTags.every(tag => 
          quote.tags.some(quoteTag => 
            quoteTag.toLowerCase() === tag.toLowerCase()
          )
        )
      );
    }

    // Mélanger les citations
    filteredQuotes = this.shuffle(filteredQuotes);

    // Limiter le nombre de résultats
    const limit = filters.limit || 1;
    return filteredQuotes.slice(0, limit);
  }

  private shuffle(array: Quote[]): Quote[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}