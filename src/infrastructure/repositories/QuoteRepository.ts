import { Quote } from '../../domain/entities/Quote';
import { IQuoteRepository } from '../../domain/repositories/IQuoteRepository';
import { quotes } from '../persistence/in-memory/quotes';
import { QuoteFiltersVO  } from '../../domain/value-objects/QuoteFilters';
import QuoteContent from '../../domain/value-objects/QuoteContent';

export class QuoteRepository implements IQuoteRepository {
    async findRandom(filters: QuoteFiltersVO ): Promise<Quote[]> {
        let filteredQuotes = [...quotes];

        // Appliquer les filtres
        if (filters.maxLength) {
            filteredQuotes = filteredQuotes.filter(
                quote => quote.content.length <= filters.maxLength!
            );
        }

        // Conversion vers les entités du domaine
        return filteredQuotes.map(quote => new Quote(
            quote._id,
            QuoteContent.create(quote.content),
            quote.author,
            quote.tags
        ));
    }

    async findById(id: string): Promise<Quote | null> {
        const quote = quotes.find(q => q._id === id);
        if (!quote) return null;

        return new Quote(
            quote._id,
            QuoteContent.create(quote.content),
            quote.author,
            quote.tags
        );
    }
}