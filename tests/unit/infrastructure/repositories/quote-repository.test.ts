// tests/unit/infrastructure/repositories/quote-repository.test.ts
import { QuoteRepository } from "../../../../src/infrastructure/repositories/QuoteRepository";
import { QuoteFilters } from "../../../../src/domain/value-objects/QuoteFilters";
import { Quote } from "../../../../src/domain/entities/Quote";

describe("QuoteRepository", () => {
  let repository: QuoteRepository;

  beforeEach(() => {
    repository = new QuoteRepository();
  });

  describe("findRandom", () => {
    it("should respect limit filter", async () => {
      const limit = 3;
      const filters = QuoteFilters.create({ limit });

      const quotes = await repository.findRandom(filters);

      expect(quotes).toHaveLength(limit);
      quotes.forEach((quote) => {
        expect(quote).toBeInstanceOf(Quote);
      });
    });

    it("should filter by maxLength", async () => {
      const maxLength = 50;
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
      const id = "WQbJJwEFP1l9";

      const quote = await repository.findById(id);

      expect(quote).not.toBeNull();
      expect(quote?.getId()).toBe(id);
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
