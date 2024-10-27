import { QuoteService } from "../../../src/services/quote.service";
import { QuoteRepository } from "../../../src/repositories/quote.repository";
import { NotFoundError, ValidationError } from "../../../src/errors";
import { Quote } from "../../../src/types/quote";

describe("QuoteService", () => {
  let quoteService: QuoteService;
  let mockRepository: jest.Mocked<QuoteRepository>;

  beforeEach(() => {
    mockRepository = {
      findRandom: jest.fn(),
      findById: jest.fn(),
    } as any;

    quoteService = new QuoteService(mockRepository);
  });

  const mockQuotes: Quote[] = [
    {
      _id: "1",
      content: "Test quote 1",
      author: "Author 1",
      tags: ["test"],
    },
    {
      _id: "2",
      content: "Test quote 2",
      author: "Author 2",
      tags: ["test", "motivation"],
    },
  ];

  describe("getRandomQuotes", () => {
    it("should return random quotes with valid filters", async () => {
      mockRepository.findRandom.mockResolvedValue(mockQuotes);

      const result = await quoteService.getRandomQuotes({ limit: 1 });
      expect(result).toHaveLength(1);
      expect(mockRepository.findRandom).toHaveBeenCalled();
    });

    it("should throw ValidationError for invalid limit", async () => {
      await expect(quoteService.getRandomQuotes({ limit: 51 })).rejects.toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError for invalid length constraints", async () => {
      await expect(
        quoteService.getRandomQuotes({
          minLength: 100,
          maxLength: 50,
        })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw NotFoundError when no quotes found", async () => {
      mockRepository.findRandom.mockResolvedValue([]);

      await expect(quoteService.getRandomQuotes({})).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("getQuoteById", () => {
    it("should return quote by id", async () => {
      mockRepository.findById.mockResolvedValue(mockQuotes[0]);

      const result = await quoteService.getQuoteById("1");
      expect(result).toEqual(mockQuotes[0]);
    });

    it("should throw NotFoundError for non-existent quote", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(quoteService.getQuoteById("999")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw ValidationError for empty id", async () => {
      await expect(quoteService.getQuoteById("")).rejects.toThrow(
        ValidationError
      );
    });
  });

  describe("error handling", () => {
    it("should handle repository errors", async () => {
      mockRepository.findRandom.mockRejectedValue(new Error("DB Error"));

      await expect(quoteService.getRandomQuotes({})).rejects.toThrow(
        "Erreur lors de la récupération des citations"
      );
    });

    it("should validate filter combinations", async () => {
      await expect(
        quoteService.getRandomQuotes({
          minLength: 100,
          maxLength: 50,
        })
      ).rejects.toThrow(
        "La longueur minimale ne peut pas être supérieure à la longueur maximale"
      );
    });

    it("should handle empty results", async () => {
      mockRepository.findRandom.mockResolvedValue([]);

      await expect(quoteService.getRandomQuotes({})).rejects.toThrow(
        "Aucune citation ne correspond aux critères"
      );
    });
  });

  describe("edge cases", () => {
    it("should handle getQuoteById with invalid id", async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(quoteService.getQuoteById("invalid")).rejects.toThrow(
        `Citation avec l'ID invalid non trouvée`
      );
    });

    it("should throw NotFoundError with correct message", async () => {
      mockRepository.findById.mockResolvedValue(null);
      try {
        await quoteService.getQuoteById("invalid");
        fail("Should have thrown an error");
      } catch (e) {
        const error = e as NotFoundError; // Type l'erreur explicitement
        expect(error).toBeInstanceOf(NotFoundError);
        expect(error.message).toBe(`Citation avec l'ID invalid non trouvée`);
        expect(error.statusCode).toBe(404);
      }
    });

    it("should validate filters thoroughly", async () => {
      await expect(quoteService.getRandomQuotes({ limit: -1 })).rejects.toThrow(
        "La limite doit être comprise entre 1 et 50"
      );

      await expect(
        quoteService.getRandomQuotes({ minLength: -1 })
      ).rejects.toThrow("La longueur minimale doit être positive");

      await expect(
        quoteService.getRandomQuotes({ maxLength: -1 })
      ).rejects.toThrow("La longueur maximale doit être positive");
    });

    it("should handle empty repository results", async () => {
      mockRepository.findRandom.mockResolvedValue([]);
      await expect(quoteService.getRandomQuotes({})).rejects.toThrow(
        "Aucune citation ne correspond aux critères"
      );
    });
  });

  describe("QuoteService Edge Cases", () => {
    const mockQuotesWithinRange = [
      {
        _id: "1",
        content: "Short1",
        author: "Author",
        tags: ["test", "motivation"],
      },
      {
        _id: "2",
        content: "Short2",
        author: "Author",
        tags: ["test", "motivation"],
      },
    ];

    it("should handle service errors properly", async () => {
      mockRepository.findRandom.mockRejectedValue(
        new Error("Unexpected error")
      );

      await expect(
        quoteService.getRandomQuotes({
          limit: 1,
          maxLength: 100,
          minLength: 50,
          tags: "test",
          author: "Author",
        })
      ).rejects.toThrow("Erreur lors de la récupération des citations");
    });

    it("should validate complex filter combinations", async () => {
      // Configure le mock pour retourner des citations valides pour ces filtres
      mockRepository.findRandom.mockResolvedValue(mockQuotesWithinRange);

      const result = await quoteService.getRandomQuotes({
        limit: 50,
        maxLength: 10,
        minLength: 5,
        tags: "test,motivation",
        author: "Author",
      });

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeLessThanOrEqual(50);

      // Vérifie que chaque citation respecte les critères
      result.forEach((quote) => {
        expect(quote.content.length).toBeLessThanOrEqual(10);
        expect(quote.content.length).toBeGreaterThanOrEqual(5);
        expect(quote.author).toBe("Author");
        expect(quote.tags).toContain("test");
        expect(quote.tags).toContain("motivation");
      });
    });

    it("should handle empty result set with complex filters", async () => {
      // Configure le mock pour simuler aucune citation trouvée
      mockRepository.findRandom.mockResolvedValue([]);

      await expect(
        quoteService.getRandomQuotes({
          limit: 50,
          maxLength: 10,
          minLength: 5,
          tags: "test,motivation",
          author: "Author",
        })
      ).rejects.toThrow("Aucune citation ne correspond aux critères");
    });

    it("should validate filters before querying repository", async () => {
      // Test avec des filtres invalides
      await expect(
        quoteService.getRandomQuotes({
          limit: 51, // Dépasse la limite maximale
          maxLength: 10,
          minLength: 5,
          tags: "test,motivation",
          author: "Author",
        })
      ).rejects.toThrow("La limite doit être comprise entre 1 et 50");
    });
  });
});
