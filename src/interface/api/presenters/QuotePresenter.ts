import { Quote } from "../../../domain/entities/Quote";
import { QuoteDTO } from "../../../application/dtos/QuoteDTO";

export class QuotePresenter {
  toDTO(quote: Quote): QuoteDTO {
    return {
      id: quote.getId(),
      content: quote.getContent().getValue(),
      authorName: quote.getAuthorId(),
      tags: [...quote.getTags()],
    };
  }
}
