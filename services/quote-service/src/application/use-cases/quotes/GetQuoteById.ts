import { IQuoteRepository } from "../../../domain/repositories/IQuoteRepository";
import type { QuoteDTO } from "@quote-generator/shared";
import { NotFoundError } from "../../../interface/errors";
import { QuotePresenter } from "../../../interface/api/presenters/QuotePresenter";

export class GetQuoteByIdUseCase {
  constructor(
    private readonly quoteRepository: IQuoteRepository,
    private readonly quotePresenter: QuotePresenter
  ) {}

  async execute(id: string): Promise<QuoteDTO> {
    const quote = await this.quoteRepository.findById(id);

    if (!quote) {
      throw new NotFoundError(`Quote with ID ${id} not found`);
    }

    return this.quotePresenter.toDTO(quote);
  }
}
