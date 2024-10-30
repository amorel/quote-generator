import { IQuoteRepository } from "../../../domain/repositories/IQuoteRepository";
import { QuoteFilters } from "../../../domain/value-objects/QuoteFilters";
import { QuotePresenter } from "../../../interface/api/presenters/QuotePresenter";
import { QuoteDTO } from "../../dtos/QuoteDTO";

export class GetRandomQuotesUseCase {
  constructor(
    private readonly quoteRepository: IQuoteRepository,
    private readonly quotePresenter: QuotePresenter
  ) {}

  async execute(filters: QuoteFilters): Promise<QuoteDTO[]> {
    const quotes = await this.quoteRepository.findRandom(filters);
    return quotes.map((quote) => this.quotePresenter.toDTO(quote));
  }
}