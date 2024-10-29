import { Quote } from "../entities/Quote";
import { QuoteFiltersVO } from "../value-objects/QuoteFilters";

export interface IQuoteRepository {
  findRandom(filters: QuoteFiltersVO): Promise<Quote[]>;
  findById(id: string): Promise<Quote | null>;
}
