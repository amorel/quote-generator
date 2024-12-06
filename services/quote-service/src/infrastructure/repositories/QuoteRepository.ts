import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/repositories/IQuoteRepository";
import { QuoteFilters } from "../../domain/value-objects/QuoteFilters";
import { QuoteModel } from "../persistence/models/QuoteModel";
import QuoteContent from "../../domain/value-objects/QuoteContent";

export class QuoteRepository implements IQuoteRepository {
  async findRandom(filters: QuoteFilters): Promise<Quote[]> {
    try {
      const query: any = {};

      if (filters.maxLength) {
        query.$expr = {
          $lte: [{ $strLenCP: "$content" }, filters.maxLength],
        };
      }

      if (filters.minLength) {
        query.$expr = {
          ...query.$expr,
          $gte: [{ $strLenCP: "$content" }, filters.minLength],
        };
      }

      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $all: filters.tags };
      }

      if (filters.author) {
        query.author = new RegExp(filters.author, "i");
      }

      const quotes = await QuoteModel.aggregate([
        { $match: query },
        { $sample: { size: filters.limit || 1 } },
      ]);

      console.log("Quotes from DB:", quotes);

      return quotes.map(
        (quote) =>
          new Quote(
            quote._id,
            QuoteContent.create(quote.content),
            quote.author,
            quote.tags
          )
      );
    } catch (error) {
      console.error("Error in QuoteRepository.findRandom:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<Quote | null> {
    try {
      const quote = await QuoteModel.findById(id);
      if (!quote) return null;

      return new Quote(
        quote._id,
        QuoteContent.create(quote.content),
        quote.author,
        quote.tags
      );
    } catch (error) {
      console.error("Error in QuoteRepository.findById:", error);
      throw error;
    }
  }
}
