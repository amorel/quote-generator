import type { QuoteDTO } from "@quote-generator/shared";
import { Quote } from "../../../domain/entities/Quote";

export class QuotePresenter {
  toDTO(quote: Quote): QuoteDTO {
    return {
      _id: quote.getId(),
      content: quote.getContent().getValue(),
      author: quote.getAuthorId(),
      tags: [...quote.getTags()],
    };
  }
}
