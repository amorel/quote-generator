import { Quote } from "../../../../src/domain/entities/Quote";
import { QuoteFilters } from "../../../../src/domain/value-objects/QuoteFilters";
import QuoteContent from "../../../../src/domain/value-objects/QuoteContent";
import { QuoteRepository } from "../../../../src/infrastructure/repositories/QuoteRepository";

jest.mock("mongoose", () => ({
  Schema: jest.fn(),
  model: jest.fn(),
  connect: jest.fn(),
}));

// Données de test
const mockQuotes = [
  {
    _id: "WQbJJwEFP1l9",
    content:
      "In the depth of winter, I finally learned that there was within me an invincible summer.",
    author: "Albert Camus",
    tags: ["Famous Quotes", "Inspirational"],
  },
  {
    _id: "SHORT1",
    content: "Short quote",
    author: "Short Author",
    tags: ["Success", "Wisdom"],
  },
  {
    _id: "LONG1",
    content:
      "This is a longer quote that will be filtered out by maxLength test",
    author: "Another Author",
    tags: ["Other"],
  },
];

class TestQuoteRepository extends QuoteRepository {
  async findRandom(filters: QuoteFilters): Promise<Quote[]> {
    let result = [...mockQuotes];

    if (filters.maxLength) {
      result = result.filter((q) => q.content.length <= filters.maxLength!);
    }

    if (filters.minLength) {
      result = result.filter((q) => q.content.length >= filters.minLength!);
    }

    if (filters.tags && filters.tags.length > 0) {
      const requiredTags = filters.tags.map((t) => t.toLowerCase());
      result = result.filter((q) =>
        requiredTags.every((tag) =>
          q.tags.some((qt) => qt.toLowerCase() === tag)
        )
      );
    }

    if (filters.author) {
      result = result.filter(
        (q) => q.author.toLowerCase() === filters.author!.toLowerCase()
      );
    }

    return result
      .slice(0, filters.limit || 1)
      .map(
        (q) =>
          new Quote(q._id, QuoteContent.create(q.content), q.author, q.tags)
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

describe("QuoteRepository", () => {
  let repository: TestQuoteRepository;

  beforeEach(() => {
    repository = new TestQuoteRepository();
  });

  describe("findRandom", () => {
    it("should respect limit filter", async () => {
      const limit = 2;
      const filters = QuoteFilters.create({ limit });

      const quotes = await repository.findRandom(filters);

      expect(quotes).toHaveLength(limit);
      quotes.forEach((quote) => {
        expect(quote).toBeInstanceOf(Quote);
      });
    });

    it("should filter by maxLength", async () => {
      const maxLength = 20; // Pour inclure "Short quote"
      const filters = QuoteFilters.create({ maxLength });

      const quotes = await repository.findRandom(filters);

      expect(quotes.length).toBeGreaterThan(0);
      quotes.forEach((quote) => {
        expect(quote.getContent().getValue().length).toBeLessThanOrEqual(
          maxLength
        );
      });
    });

    it("should filter by minLength", async () => {
      const minLength = 20;
      const filters = QuoteFilters.create({ minLength });

      const quotes = await repository.findRandom(filters);

      expect(quotes.length).toBeGreaterThan(0);
      quotes.forEach((quote) => {
        expect(quote.getContent().getValue().length).toBeGreaterThanOrEqual(
          minLength
        );
      });
    });

    it("should filter by tags", async () => {
      const tags = "Success,Wisdom";
      const filters = QuoteFilters.create({ tags });

      const quotes = await repository.findRandom(filters);

      expect(quotes.length).toBeGreaterThan(0);
      quotes.forEach((quote) => {
        const quoteTags = quote.getTags().map((tag) => tag.toLowerCase());
        const requiredTags = tags.split(",").map((tag) => tag.toLowerCase());
        requiredTags.forEach((tag) => {
          expect(quoteTags).toContain(tag.toLowerCase());
        });
      });
    });

    it("should filter by author", async () => {
      const author = "Albert Camus";
      const filters = QuoteFilters.create({ author });

      const quotes = await repository.findRandom(filters);

      expect(quotes.length).toBeGreaterThan(0);
      quotes.forEach((quote) => {
        expect(quote.getAuthorId().toLowerCase()).toBe(author.toLowerCase());
      });
    });

    it("should handle empty filters", async () => {
      const filters = QuoteFilters.create({});

      const quotes = await repository.findRandom(filters);

      expect(quotes.length).toBeGreaterThan(0);
    });

    it("should handle multiple filters together", async () => {
      const filters = QuoteFilters.create({
        limit: 2,
        maxLength: 100,
        tags: "Success",
        author: "Albert Camus",
      });

      const quotes = await repository.findRandom(filters);

      expect(quotes.length).toBeLessThanOrEqual(2);
      quotes.forEach((quote) => {
        expect(quote.getContent().getValue().length).toBeLessThanOrEqual(100);
        expect(quote.getTags().map((t) => t.toLowerCase())).toContain(
          "success"
        );
        expect(quote.getAuthorId().toLowerCase()).toBe("albert camus");
      });
    });
  });

  describe("findById", () => {
    it("should find quote by id", async () => {
      const quote = await repository.findById("WQbJJwEFP1l9");
      expect(quote).not.toBeNull();
      expect(quote?.getId()).toBe("WQbJJwEFP1l9");
      expect(quote?.getContent().getValue()).toBe(
        "In the depth of winter, I finally learned that there was within me an invincible summer."
      );
      expect(quote?.getAuthorId()).toBe("Albert Camus");
      expect(quote?.getTags()).toEqual(["Famous Quotes", "Inspirational"]);
    });

    it("should return null for non-existent id", async () => {
      const quote = await repository.findById("non-existent-id");
      expect(quote).toBeNull();
    });
  });
});
