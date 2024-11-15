import { FastifyRequest, FastifyReply } from "fastify";
import { GetRandomQuotesUseCase } from "../../../application/use-cases/quotes/GetRandomQuotes";
import { GetQuoteByIdUseCase } from "../../../application/use-cases/quotes/GetQuoteById";
import { QuoteFilters } from "../../../domain/value-objects/QuoteFilters";
import { NotFoundError } from "../../errors";
import { ToggleQuoteFavoriteUseCase } from "@/application/use-cases/quotes/ToggleQuoteFavorite";

// Interface pour typer la query
interface QuoteQuerystring {
  limit?: number;
  maxLength?: number;
  minLength?: number;
  tags?: string;
  author?: string;
}

// Type pour la requête Fastify
type QuoteRequest = FastifyRequest<{
  Querystring: QuoteQuerystring;
}>;

export class QuoteController {
  constructor(
    private readonly getRandomQuotesUseCase: GetRandomQuotesUseCase,
    private readonly getQuoteByIdUseCase: GetQuoteByIdUseCase,
    private readonly toggleQuoteFavoriteUseCase: ToggleQuoteFavoriteUseCase
  ) {}

  async getRandomQuotes(request: QuoteRequest, _reply: FastifyReply) {
    try {
      const filters = QuoteFilters.create({
        limit: request.query.limit,
        maxLength: request.query.maxLength,
        minLength: request.query.minLength,
        tags: request.query.tags,
        author: request.query.author,
      });

      console.log(
        "QuoteController: Getting random quotes with filters:",
        filters
      );
      const quotes = await this.getRandomQuotesUseCase.execute(filters);
      console.log("QuoteController: Quotes retrieved:", quotes);
      return quotes;
    } catch (error) {
      console.error("QuoteController error:", error);
      throw error;
    }
  }

  async getQuoteById(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const quote = await this.getQuoteByIdUseCase.execute(request.params.id);
      return reply.send(quote);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return reply.status(404).send({
          status: "error",
          message: error.message,
        });
      }
      return reply.status(500).send({
        status: "error",
        message: "Internal server error",
      });
    }
  }

  async toggleFavorite(
    request: FastifyRequest<{
      Params: { id: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.headers["x-user-id"] as string;
      const quoteId = request.params.id;
      const isFavorite = request.method === "POST";

      console.log("⭐ Toggle favorite debug:", {
        userId,
        quoteId,
        isFavorite,
        headers: request.headers,
        method: request.method,
      });

      if (!userId || !quoteId) {
        console.log("❌ Missing required data:", { userId, quoteId });
        return reply.status(400).send({
          status: "error",
          message: "Missing required data",
        });
      }

      await this.toggleQuoteFavoriteUseCase.execute(
        quoteId,
        userId,
        isFavorite
      );

      return reply.status(200).send({
        status: "success",
        message: isFavorite
          ? "Quote added to favorites"
          : "Quote removed from favorites",
      });
    } catch (error) {
      console.error("❌ Error in toggleFavorite:", error);
      return reply.status(500).send({
        status: "error",
        message:
          error instanceof Error ? error.message : "Internal server error",
        details: process.env.NODE_ENV === "development" ? error : undefined,
      });
    }
  }
}
