import { Quote } from "../../domain/entities/Quote";
import { IQuoteRepository } from "../../domain/repositories/IQuoteRepository";
import { QuoteFilters } from "../../domain/value-objects/QuoteFilters";
import QuoteContent from "../../domain/value-objects/QuoteContent";
import mongoose, { Document } from "mongoose";

// Interface pour le document MongoDB
interface IQuoteDocument extends Document {
  _id: string;
  content: string;
  author: string;
  tags: string[];
}

// Définition du schéma avec les champs requis
const quoteSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: [String], required: true, default: [] },
});

const QuoteModel = mongoose.model<IQuoteDocument>("Quote", quoteSchema);

export class QuoteRepository implements IQuoteRepository {
  async findRandom(filters: QuoteFilters): Promise<Quote[]> {
    const query: any = {};

    if (filters.maxLength) {
      query.$expr = { $lte: [{ $strLenCP: "$content" }, filters.maxLength] };
    }

    if (filters.minLength) {
      query.$expr = {
        ...query.$expr,
        $gte: [{ $strLenCP: "$content" }, filters.minLength],
      };
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $all: filters.tags.map((tag) => new RegExp(tag, "i")) };
    }

    if (filters.author) {
      query.author = new RegExp(filters.author, "i");
    }

    const quoteDocs = await QuoteModel.aggregate<IQuoteDocument>([
      { $match: query },
      { $sample: { size: filters.limit || 1 } },
    ]);

    // Vérification et conversion en entités du domaine
    return quoteDocs
      .filter((quote) => quote && quote.content && quote.author)
      .map(
        (quote) =>
          new Quote(
            quote._id,
            QuoteContent.create(quote.content),
            quote.author,
            quote.tags || [] 
          )
      );
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = await QuoteModel.findById(id).lean(); // .lean() pour avoir un objet JS simple

    if (!quote || !quote.content || !quote.author) {
      return null;
    }

    return new Quote(
      quote._id,
      QuoteContent.create(quote.content),
      quote.author,
      quote.tags || []
    );
  }
}
