import type { QuoteDTO } from "@quote-generator/shared";
import { Quote } from "../../../domain/entities/Quote";

export class QuotePresenter {
  toDTO(quote: Quote): QuoteDTO {
    const id = quote.getId();
    if (!id) {
      console.error("Quote without ID:", quote);
      throw new Error("Quote missing ID in presenter");
    }
    return {
      _id: quote.getId(),
      content: quote.getContent().getValue(),
      author: quote.getAuthorId(),
      tags: [...quote.getTags()],
    };
  }
}
