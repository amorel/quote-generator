import { build } from "../../src/app";
import { FastifyInstance } from "fastify";
import { Container } from "../../src/container";
import { IQuoteRepository } from "../../src/domain/repositories/IQuoteRepository";
import { Quote } from "../../src/domain/entities/Quote";
import QuoteContent from "../../src/domain/value-objects/QuoteContent";
import { QuoteController } from "../../src/interface/api/controllers/QuoteController";
import { GetRandomQuotesUseCase } from "../../src/application/use-cases/quotes/GetRandomQuotes";
import { GetQuoteByIdUseCase } from "../../src/application/use-cases/quotes/GetQuoteById";
import { QuotePresenter } from "../../src/interface/api/presenters/QuotePresenter";

interface MockServices {
  quoteRepository: IQuoteRepository;
  jwtService: any;
  quoteController: QuoteController;
  [key: string]: any;
}

// Mock data
const mockQuotes = [
  {
    _id: "WQbJJwEFP1l9",
    content: "In the depth of winter...",
    author: "Albert Camus",
    tags: ["Famous Quotes", "Inspirational"],
  },
];

class MockJWTService {
  verifyToken(token: string) {
    return {
      id: "test-user-id",
      email: "test@example.com",
      role: "user",
    };
  }
}

class MockQuoteRepository implements IQuoteRepository {
  async findRandom() {
    return mockQuotes.map(
      (q) => new Quote(q._id, QuoteContent.create(q.content), q.author, q.tags)
    );
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = mockQuotes.find((q) => q._id === id);
    if (!quote) return null;

    return new Quote(
      quote._id,
      QuoteContent.create(quote.content),
      quote.author,
      quote.tags
    );
  }
}

describe("API Integration Tests", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    try {
      const mockQuoteRepository = new MockQuoteRepository();
      const quotePresenter = new QuotePresenter();

      const mockServices: MockServices = {
        quoteRepository: mockQuoteRepository,
        jwtService: new MockJWTService(),
        quoteController: new QuoteController(
          new GetRandomQuotesUseCase(mockQuoteRepository, quotePresenter),
          new GetQuoteByIdUseCase(mockQuoteRepository, quotePresenter)
        ),
      };

      jest.spyOn(Container, "getInstance").mockImplementation(
        () =>
          ({
            get: (key: string) => {
              if (key in mockServices) {
                return mockServices[key];
              }
              throw new Error(`Service ${key} not found in mock container`);
            },
          } as Container)
      );

      app = await build();
    } catch (error) {
      console.error("Failed to build app:", error);
      throw error;
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    jest.restoreAllMocks();
  });

  describe("GET /quotes/random", () => {
    it("should filter quotes by maxLength", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?maxLength=100",
      });

      expect(response.statusCode).toBe(200);
      const payload = JSON.parse(response.payload);
      expect(Array.isArray(payload)).toBe(true);
      if (payload.length > 0) {
        expect(payload[0].content.length).toBeLessThanOrEqual(100);
      }
    });
  });

  describe("Error Handling", () => {
    it("should handle invalid quote id", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/invalid-id",
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("status", "error");
    });

    it("should handle invalid limit parameter", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?limit=invalid",
      });

      expect(response.statusCode).toBe(400);
      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty("status", "error");
    });
  });
});
