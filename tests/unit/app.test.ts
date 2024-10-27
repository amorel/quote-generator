import { build } from "../../src/app";
import { FastifyInstance } from "fastify";
import { QuoteService } from "../../src/services/quote.service";
import { Quote } from "../../src/types/quote";
import { NotFoundError } from "../../src/errors";

// Mock QuoteService
jest.mock("../../src/services/quote.service");

describe("App", () => {
  let app: FastifyInstance;

  const mockQuotes: Quote[] = [
    {
      _id: "1",
      content: "Test quote 1",
      author: "Author",
      tags: ["test"],
    },
    {
      _id: "2",
      content: "This is a test quote",
      author: "Author",
      tags: ["test", "motivation"],
    },
  ];

  beforeEach(async () => {
    // Reset les mocks
    jest.clearAllMocks();

    // Mock getRandomQuotes pour retourner des données de test
    (QuoteService.prototype.getRandomQuotes as jest.Mock).mockResolvedValue(
      mockQuotes.slice(0, 2)
    );

    // Mock getQuoteById pour simuler l'erreur 404
    (QuoteService.prototype.getQuoteById as jest.Mock).mockImplementation(
      async (id: string) => {
        if (id === "nonexistent-id") {
          throw new NotFoundError(`Quote with ID ${id} not found`);
        }
        return mockQuotes[0];
      }
    );

    app = await build();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  it("should build app with all plugins registered", async () => {
    app = await build();
    expect(app.hasPlugin("@fastify/cors")).toBe(true);
    expect(app.hasPlugin("@fastify/swagger")).toBe(true);
    expect(app.hasPlugin("@fastify/swagger-ui")).toBe(true);
  });

  describe("Routes", () => {
    beforeEach(async () => {
      app = await build();
    });

    it("should handle health check", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/health",
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual({ status: "ok" });
    });

    it("should handle errors in quote route", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/nonexistent-id",
      });

      expect(response.statusCode).toBe(404);
      const payload = JSON.parse(response.payload);
      expect(payload).toEqual({
        status: "error",
        message: "Quote with ID nonexistent-id not found",
      });
    });

    it("should handle validation errors in random quotes route", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?limit=invalid",
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("API Routes", () => {
    it("should get random quotes with all filters", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?limit=2&maxLength=100&minLength=10&tags=test&author=Author",
      });

      expect(response.statusCode).toBe(200);
      const quotes = JSON.parse(response.payload);
      expect(Array.isArray(quotes)).toBe(true);
      expect(quotes.length).toBeLessThanOrEqual(2);
    });

    it("should handle undefined query parameters", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random",
      });
      expect(response.statusCode).toBe(200);
    });

    it("should handle server errors", async () => {
      // Force une erreur serveur
      (QuoteService.prototype.getRandomQuotes as jest.Mock).mockRejectedValue(
        new Error("Server error")
      );

      const response = await app.inject({
        method: "GET",
        url: "/quotes/random",
      });
      expect(response.statusCode).toBe(500);
    });
  });

  describe("App Error Handling", () => {
    it("should handle server errors in random quotes route", async () => {
      (QuoteService.prototype.getRandomQuotes as jest.Mock).mockRejectedValue(
        new Error("Server error")
      );
      
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random"
      });
      
      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.payload)).toEqual({
        status: 'error',
        message: 'Une erreur interne est survenue'
      });
    });
  
    it("should handle complex query parameters", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/quotes/random?limit=2&maxLength=100&minLength=10&tags=test,motivation&author=Author"
      });
      
      expect(response.statusCode).toBe(200);
      const quotes = JSON.parse(response.payload);
      expect(Array.isArray(quotes)).toBe(true);
    });
  });
});
