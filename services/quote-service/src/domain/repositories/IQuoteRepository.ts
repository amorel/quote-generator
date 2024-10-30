import { Quote } from "../entities/Quote";
import { QuoteFilters } from "../value-objects/QuoteFilters";

export interface IQuoteRepository {
  findRandom(filters: QuoteFilters): Promise<Quote[]>;
  findById(id: string): Promise<Quote | null>;
}
